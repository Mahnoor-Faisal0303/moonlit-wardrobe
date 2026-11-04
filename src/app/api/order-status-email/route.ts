import nodemailer from "nodemailer";
import { FIRESTORE, verifyAdmin } from "@/lib/admin-auth";
import { PROGRESS_STEPS, orderNumber } from "@/lib/orders";

// Emails the customer about their order's current status. Only a signed-in admin can call it.
//
// No service-account key is needed: the admin's own Firebase ID token is used to check that they are
// an admin and to read the order, so the Firestore rules decide what is allowed. The status in the email
// always comes from the order in the database, never from the request.

type Fields = Record<string, { stringValue?: string; mapValue?: { fields: Fields } }>;

const reply = (status: number, error: string) => Response.json({ error }, { status });
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const MESSAGES: Record<string, { subject: string; text: string }> = {
  confirmed: { subject: "is confirmed", text: "Good news, your order is confirmed and we are getting it ready." },
  shipped: { subject: "is on its way", text: "Your order has been shipped and is on its way to you. Please keep the cash ready for delivery." },
  delivered: { subject: "was delivered", text: "Your order has been delivered. Thank you for shopping with Moonlit Wardrobe!" },
  cancelled: { subject: "was cancelled", text: "Your order has been cancelled. If you did not expect this, please contact us." },
};

export async function POST(request: Request) {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return reply(503, "Email is not set up. Add GMAIL_USER and GMAIL_APP_PASSWORD to the environment variables.");
  }

  const body = (await request.json().catch(() => null)) as { orderId?: unknown } | null;
  const orderId = typeof body?.orderId === "string" && /^[A-Za-z0-9]{20}$/.test(body.orderId) ? body.orderId : null;
  if (!orderId) return reply(400, "Invalid request.");

  const admin = await verifyAdmin(request);
  if (!admin.ok) return reply(admin.status, admin.error);
  const token = admin.token;

  const orderDoc = await fetch(`${FIRESTORE}/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!orderDoc.ok) return reply(404, "Order not found.");
  const fields = ((await orderDoc.json()) as { fields: Fields }).fields;
  const status = fields.status?.stringValue ?? "";
  const contact = fields.contact?.mapValue?.fields ?? {};
  const email = contact.email?.stringValue;
  const name = contact.name?.stringValue ?? "there";
  const message = MESSAGES[status];
  if (!message) return reply(200, "No email is sent for this status.");
  if (!email) return reply(422, "This order has no email address.");

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const link = `${origin}/orders/${orderId}`;
  const number = orderNumber(orderId);
  const step = PROGRESS_STEPS.find((s) => s.status === status)?.label ?? status;

  // Sent through the shop's Gmail account with an App Password (Google Account > Security > App passwords).
  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD.replace(/\s/g, "") } });
  try {
    await transporter.sendMail({
      from: `Moonlit Wardrobe <${GMAIL_USER}>`,
      to: email,
      subject: `Your order ${number} ${message.subject}`,
      text: `Hi ${name},

${message.text}

Order: ${number}
Status: ${step}
Track your order: ${link}

Moonlit Wardrobe`,
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#222">
        <h2 style="color:#5b3fd1">Moonlit Wardrobe</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>${message.text}</p>
        <p><strong>Order:</strong> ${number}<br><strong>Status:</strong> ${escapeHtml(step)}</p>
        <p><a href="${link}" style="display:inline-block;background:#5b3fd1;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Track your order</a></p>
      </div>`,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "";
    console.error("Could not send the order email:", detail);
    const badLogin = /Invalid login|Username and Password not accepted|EAUTH/i.test(detail);
    return reply(502, badLogin ? "Gmail refused the login. Check GMAIL_USER and that GMAIL_APP_PASSWORD is an App Password." : `The email could not be sent${detail ? `: ${detail}` : "."}`);
  }

  return Response.json({ sent: true, to: email });
}
