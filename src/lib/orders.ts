import type { DocumentData, Timestamp } from "firebase/firestore";

export const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type Status = (typeof STATUSES)[number];

/** The steps of a normal order, in order. A cancelled order leaves this path. */
export const PROGRESS_STEPS: { status: Exclude<Status, "cancelled">; label: string; hint: string }[] = [
  { status: "pending", label: "Order placed", hint: "We have received your order." },
  { status: "confirmed", label: "Confirmed", hint: "Your order is confirmed and being prepared." },
  { status: "shipped", label: "Shipped", hint: "Your order is on its way." },
  { status: "delivered", label: "Delivered", hint: "Your order has arrived. Thank you!" },
];

export type OrderItem = { id: string; name: string; size: string; qty: number; unitPrice: number };

export type Order = {
  id: string;
  status: Status;
  createdAt: Date | null;
  /** When the order reached each status; the placed time is the order's creation time. */
  statusTimes: Partial<Record<Status, Date>>;
  guest: boolean;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
};

/** Short number shown to people, e.g. MW-ABC12345. */
export const orderNumber = (id: string) => `MW-${id.slice(0, 8).toUpperCase()}`;

export function orderFromDoc(id: string, d: DocumentData): Order {
  const createdAt = d.createdAt ? (d.createdAt as Timestamp).toDate() : null;
  const statusTimes: Order["statusTimes"] = {};
  for (const s of STATUSES) {
    const t = d.statusTimes?.[s] as Timestamp | undefined;
    if (t) statusTimes[s] = t.toDate();
  }
  if (createdAt && !statusTimes.pending) statusTimes.pending = createdAt;
  return {
    id,
    status: STATUSES.includes(d.status) ? d.status : "pending",
    createdAt,
    statusTimes,
    guest: !d.userId,
    name: d.contact?.name ?? "",
    email: d.contact?.email ?? "",
    phone: d.contact?.phone ?? "",
    address: d.shipping?.address ?? "",
    city: d.shipping?.city ?? "",
    postalCode: d.shipping?.postalCode ?? "",
    notes: d.notes ?? "",
    items: Array.isArray(d.items) ? d.items : [],
    subtotal: Number(d.subtotal) || 0,
  };
}
