"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { formatRs, PLACEHOLDER_IMAGE, priceToNumber } from "@/data/content";
import { getDb, isFirebaseConfigured, NOT_CONFIGURED_MESSAGE } from "@/lib/firebase";
import { orderNumber } from "@/lib/orders";
import { validateEmail, validateName, validatePhone, validateRequired } from "@/lib/validation";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import { TextField } from "./fields";
import { useItems } from "./ItemsProvider";
import { Button, ButtonLink } from "./ui";

/** `email` is null until the customer edits it; until then their account email is used. */
type Form = { name: string; email: string | null; phone: string; address: string; city: string; postalCode: string; notes: string };
type Errors = Partial<Record<keyof Form, string>>;

const emptyForm: Form = { name: "", email: null, phone: "", address: "", city: "", postalCode: "", notes: "" };

function validate(f: Record<keyof Form, string>): Errors {
  const errors: Errors = {
    name: validateName(f.name, "Name") ?? undefined,
    email: validateEmail(f.email) ?? undefined,
    phone: validatePhone(f.phone) ?? undefined,
    address: validateRequired(f.address, "your address", 8, 200) ?? undefined,
    city: validateRequired(f.city, "your city", 2, 60) ?? undefined,
    postalCode: f.postalCode && !/^[A-Za-z0-9 -]{3,10}$/.test(f.postalCode) ? "Please enter a valid postal code, or leave it empty." : undefined,
  };
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v)) as Errors;
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center text-sm text-muted">{children}</div>;
}

export default function CheckoutView() {
  const { user, loading: authLoading } = useAuth();
  const { lines, clear } = useCart();
  const { items: catalog, loaded } = useItems();
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const items = lines.flatMap((l) => {
    const card = catalog.find((c) => c.id === l.id);
    return card ? [{ card, size: l.size, qty: l.qty, unit: priceToNumber(card.discountedPrice ?? card.price) }] : [];
  });
  const subtotal = items.reduce((sum, i) => sum + i.unit * i.qty, 0);

  const set = (key: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = Object.fromEntries(Object.entries({ ...form, email: form.email ?? user?.email ?? "" }).map(([k, v]) => [k, (v ?? "").trim()])) as Record<keyof Form, string>;
    const found = validate(trimmed);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitError(null);
    setSaving(true);
    try {
      const ref = await addDoc(collection(getDb(), "orders"), {
        // Guests can order too; their order has no user.
        userId: user?.userId ?? null,
        contact: { name: trimmed.name, email: trimmed.email, phone: trimmed.phone },
        shipping: { address: trimmed.address, city: trimmed.city, postalCode: trimmed.postalCode },
        notes: trimmed.notes,
        paymentMethod: "cod",
        items: items.map((i) => ({ id: i.card.id, name: i.card.name, size: i.size ?? "", qty: i.qty, unitPrice: i.unit })),
        subtotal,
        status: "pending",
        statusTimes: { pending: serverTimestamp() },
        createdAt: serverTimestamp(),
      });
      setOrderId(ref.id);
      clear();
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setSubmitError(
        code.includes("permission")
          ? "We couldn't place your order (permission denied). Publish the latest firestore.rules, then try again."
          : "We couldn't place your order. Check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (orderId) {
    return (
      <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center">
        <h2 className="text-xl font-semibold text-fg">Thank you, your order is placed!</h2>
        <p className="mt-3 text-sm text-muted">
          Order number: <span className="font-medium text-fg">{orderNumber(orderId)}</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          Tracking code: <code className="select-all rounded bg-surface-strong px-1.5 py-0.5 text-xs text-fg">{orderId}</code>
        </p>
        <p className="mt-1 text-xs text-muted">Keep this code to follow your order, even without an account.</p>
        <p className="mt-1 text-sm text-muted">Please keep the cash ready. You will pay when the order arrives.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href={`/orders/${orderId}`}>Track your order</ButtonLink>
          <ButtonLink href="/explore" variant="ghost">Continue shopping</ButtonLink>
        </div>
      </div>
    );
  }

  if (!isFirebaseConfigured) return <Notice>{NOT_CONFIGURED_MESSAGE}</Notice>;
  if (authLoading || (!loaded && lines.length > 0 && items.length === 0)) {
    return <div className="mt-10 h-64 animate-pulse rounded-lg bg-surface-strong" aria-busy />;
  }
  if (items.length === 0) {
    return (
      <Notice>
        <p>Your bag is empty.</p>
        <ButtonLink href="/explore" className="mt-5">Continue shopping</ButtonLink>
      </Notice>
    );
  }
  return (
    <form onSubmit={onSubmit} noValidate className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-8">
        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="text-base font-semibold text-fg">Contact information</h2>
          <div className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            <TextField label="Full name" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} maxLength={50} className="sm:col-span-2" />
            <TextField label="Email" type="email" autoComplete="email" value={form.email ?? user?.email ?? ""} onChange={set("email")} error={errors.email} maxLength={100} />
            <TextField label="Phone number" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set("phone")} error={errors.phone} maxLength={20} />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="text-base font-semibold text-fg">Shipping address</h2>
          <div className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            <TextField label="Street address" autoComplete="street-address" value={form.address} onChange={set("address")} error={errors.address} maxLength={200} className="sm:col-span-2" />
            <TextField label="City" autoComplete="address-level2" value={form.city} onChange={set("city")} error={errors.city} maxLength={60} />
            <TextField label="Postal code (optional)" autoComplete="postal-code" value={form.postalCode} onChange={set("postalCode")} error={errors.postalCode} maxLength={10} />
          </div>
          <label htmlFor="checkout-notes" className="mt-2 block text-xs text-muted">Delivery notes (optional)</label>
          <textarea
            id="checkout-notes"
            value={form.notes}
            onChange={set("notes")}
            rows={2}
            maxLength={300}
            className="mt-1 w-full rounded-md border border-line bg-transparent p-3 text-sm text-fg outline-none focus:border-primary"
          />
        </section>

        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="text-base font-semibold text-fg">Payment</h2>
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md border border-primary bg-primary-soft p-4">
            <input type="radio" name="payment" value="cod" checked readOnly className="mt-1 accent-[var(--primary)]" />
            <span>
              <span className="block text-sm font-medium text-fg">Cash on delivery</span>
              <span className="mt-0.5 block text-xs text-muted">Pay in cash when your order arrives. More payment methods are coming soon.</span>
            </span>
          </label>
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-fg">Order summary</h2>
        <ul className="mt-4 divide-y divide-line">
          {items.map(({ card, size, qty, unit }) => (
            <li key={`${card.id}|${size ?? ""}`} className="flex gap-3 py-3">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-surface-strong">
                <Image src={card.images[0] ?? PLACEHOLDER_IMAGE} alt="" fill sizes="48px" className="object-cover object-top" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{card.name}</p>
                <p className="text-xs text-muted">{size ? `Size ${size} · ` : ""}Qty {qty}</p>
              </div>
              <span className="text-sm text-fg">{formatRs(unit * qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-line pt-4 text-sm text-muted">
          <span>Subtotal</span>
          <span className="text-fg">{formatRs(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-muted">
          <span>Delivery</span>
          <span>Confirmed by phone</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-line pt-4 text-base font-semibold text-fg">
          <span>Total</span>
          <span>{formatRs(subtotal)}</span>
        </div>

        <p role="alert" className="mt-4 min-h-5 text-xs text-danger">{submitError}</p>
        <Button type="submit" loading={saving} className="w-full !py-3 uppercase tracking-wider">
          {saving ? "Placing order…" : "Place order"}
        </Button>
        <Link href="/bag" className="mt-3 block text-center text-xs text-muted hover:text-fg">Back to bag</Link>
      </aside>
    </form>
  );
}
