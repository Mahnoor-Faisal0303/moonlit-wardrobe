"use client";

import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { formatRs } from "@/data/content";
import { getDb, getFirebaseAuth } from "@/lib/firebase";
import { orderFromDoc, orderNumber, STATUSES, type Order, type Status } from "@/lib/orders";
import AdminGate from "./AdminGate";

const statusStyle: Record<Status, string> = {
  pending: "bg-primary-soft text-accent",
  confirmed: "bg-primary-soft text-accent",
  shipped: "bg-primary-soft text-accent",
  delivered: "bg-surface-strong text-fg",
  cancelled: "bg-danger/15 text-danger",
};

export default function OrdersPanel() {
  return (
    <AdminGate>
      {() => (
        <>
          <p className="mt-4 text-sm text-muted">Orders placed by customers. All orders are cash on delivery.</p>
          <Orders />
        </>
      )}
    </AdminGate>
  );
}

function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "all">("all");

  useEffect(
    () =>
      onSnapshot(
        query(collection(getDb(), "orders"), orderBy("createdAt", "desc"), limit(200)),
        (snap) => setOrders(snap.docs.map((d) => orderFromDoc(d.id, d.data()))),
        (err) =>
          setError(
            err.code === "permission-denied"
              ? "Permission denied. Publish the latest firestore.rules and make sure your account is listed in admins."
              : `Could not load the orders (${err.code}).`,
          ),
      ),
    [],
  );

  if (error) return <p role="alert" className="mt-8 text-sm text-danger">{error}</p>;
  if (!orders) return <div className="mt-8 h-48 animate-pulse rounded-lg bg-surface-strong" aria-busy />;

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const count = (s: Status) => orders.filter((o) => o.status === s).length;

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
              filter === s ? "border-primary bg-primary text-primary-fg" : "border-line text-muted hover:text-fg"
            }`}
          >
            {s} ({s === "all" ? orders.length : count(s)})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 rounded-lg border border-line bg-surface p-10 text-center text-sm text-muted">No orders here yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {shown.map((o) => <OrderCard key={o.id} order={o} />)}
        </ul>
      )}
    </>
  );
}

function OrderCard({ order: o }: { order: Order }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  /** Tells the customer by email. A failure here never undoes the status change. */
  async function notifyCustomer() {
    try {
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/order-status-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: o.id }),
      });
      const data = (await res.json().catch(() => ({}))) as { sent?: boolean; to?: string; error?: string };
      if (data.sent) setInfo(`Status updated. Email sent to ${data.to}.`);
      else setInfo(`Status updated, but no email was sent${data.error ? `: ${data.error}` : "."}`);
    } catch {
      setInfo("Status updated, but the email could not be sent. Check your connection.");
    }
  }

  async function setStatus(status: Status) {
    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      await updateDoc(doc(getDb(), "orders", o.id), { status, [`statusTimes.${status}`]: serverTimestamp() });
      if (status !== "pending") await notifyCustomer();
    } catch {
      setError("Could not update the status. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="rounded-lg border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="text-sm font-semibold text-fg">{orderNumber(o.id)}</h2>
        <span className="text-xs text-muted">{o.createdAt ? o.createdAt.toLocaleString() : "Just now"}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyle[o.status]}`}>{o.status}</span>
        <label className="ml-auto flex items-center gap-2 text-xs text-muted">
          Status
          <select
            value={o.status}
            disabled={saving}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="rounded-md border border-line bg-base px-2 py-1 text-xs capitalize text-fg outline-none focus:border-primary disabled:opacity-50"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <p role="alert" className="min-h-4 text-xs text-danger">{error}</p>
      <p role="status" className="text-xs text-accent">{info}</p>

      <div className="mt-3 grid gap-6 text-sm md:grid-cols-2">
        <div className="space-y-1 text-muted">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg">Customer{o.guest && " (guest)"}</p>
          <p className="text-fg">{o.name}</p>
          <p><a href={`tel:${o.phone}`} className="hover:text-fg">{o.phone}</a></p>
          <p><a href={`mailto:${o.email}`} className="break-all hover:text-fg">{o.email}</a></p>
        </div>
        <div className="space-y-1 text-muted">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg">Ship to</p>
          <p className="text-fg">{o.address}</p>
          <p>{o.city}{o.postalCode && `, ${o.postalCode}`}</p>
          {o.notes && <p className="italic">&ldquo;{o.notes}&rdquo;</p>}
        </div>
      </div>

      <ul className="mt-4 divide-y divide-line border-t border-line text-sm">
        {o.items.map((i, idx) => (
          <li key={idx} className="flex justify-between gap-4 py-2">
            <span className="min-w-0 text-fg">
              {i.name}
              <span className="text-muted">{i.size && ` · Size ${i.size}`} · Qty {i.qty}</span>
            </span>
            <span className="shrink-0 text-fg">{formatRs(i.unitPrice * i.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between border-t border-line pt-3 text-sm font-semibold text-fg">
        <span>Total <span className="font-normal text-muted">· Cash on delivery</span></span>
        <span>{formatRs(o.subtotal)}</span>
      </div>
    </li>
  );
}
