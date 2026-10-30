"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { formatRs } from "@/data/content";
import { getDb, isFirebaseConfigured, NOT_CONFIGURED_MESSAGE } from "@/lib/firebase";
import { orderFromDoc, orderNumber, type Order, type Status } from "@/lib/orders";
import { useAuth } from "./AuthProvider";
import { TextField } from "./fields";
import { Button, ButtonLink } from "./ui";

const statusStyle: Record<Status, string> = {
  pending: "bg-primary-soft text-accent",
  confirmed: "bg-primary-soft text-accent",
  shipped: "bg-primary-soft text-accent",
  delivered: "bg-surface-strong text-fg",
  cancelled: "bg-danger/15 text-danger",
};

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();

  if (!isFirebaseConfigured) {
    return <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center text-sm text-muted">{NOT_CONFIGURED_MESSAGE}</div>;
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
      <section>
        {authLoading ? (
          <div className="h-48 animate-pulse rounded-lg bg-surface-strong" aria-busy />
        ) : user ? (
          <OrderList userId={user.userId} />
        ) : (
          <div className="rounded-lg border border-line bg-surface p-10 text-center">
            <p className="text-sm text-muted">Sign in to see all the orders you placed with your account.</p>
            <ButtonLink href="/signin" className="mt-5">Sign in</ButtonLink>
          </div>
        )}
      </section>
      <TrackByCode />
    </div>
  );
}

function OrderList({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      onSnapshot(
        query(collection(getDb(), "orders"), where("userId", "==", userId)),
        // Newest first; sorted here so no extra database index is needed.
        (snap) => setOrders(snap.docs.map((d) => orderFromDoc(d.id, d.data())).sort((a, b) => (b.createdAt?.getTime() ?? Infinity) - (a.createdAt?.getTime() ?? Infinity))),
        (err) => setError(err.code === "permission-denied" ? "We could not load your orders (permission denied). Publish the latest firestore.rules." : "We could not load your orders. Try again."),
      ),
    [userId],
  );

  if (error) return <p role="alert" className="text-sm text-danger">{error}</p>;
  if (!orders) return <div className="h-48 animate-pulse rounded-lg bg-surface-strong" aria-busy />;
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-surface p-10 text-center">
        <p className="text-sm text-muted">You have not placed any orders yet.</p>
        <ButtonLink href="/explore" className="mt-5">Start shopping</ButtonLink>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((o) => {
        const count = o.items.reduce((n, i) => n + i.qty, 0);
        return (
          <li key={o.id} className="rounded-lg border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h2 className="text-sm font-semibold text-fg">{orderNumber(o.id)}</h2>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyle[o.status]}`}>{o.status}</span>
              <span className="ml-auto text-xs text-muted">{o.createdAt ? o.createdAt.toLocaleDateString(undefined, { dateStyle: "medium" }) : "Just now"}</span>
            </div>
            <p className="mt-2 truncate text-sm text-muted">{o.items.map((i) => i.name).join(", ")}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-fg">{count} {count === 1 ? "item" : "items"} · {formatRs(o.subtotal)}</span>
              <Link href={`/orders/${o.id}`} className="text-xs font-medium text-accent hover:underline">Track order →</Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** For customers who ordered as a guest: the tracking code from the order confirmation. */
function TrackByCode() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = code.trim();
    if (!/^[A-Za-z0-9]{20}$/.test(value)) return setError("Enter the 20-character tracking code from your order confirmation.");
    router.push(`/orders/${value}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="h-fit rounded-lg border border-line bg-surface p-5">
      <h2 className="text-base font-semibold text-fg">Track with a code</h2>
      <p className="mt-1 text-xs text-muted">Ordered without an account? Enter the tracking code shown when you placed your order.</p>
      <TextField label="Tracking code" value={code} onChange={(e) => { setCode(e.target.value); setError(null); }} error={error} maxLength={20} autoComplete="off" className="mt-2" />
      <Button type="submit" className="w-full !py-3 uppercase tracking-wider">Track order</Button>
    </form>
  );
}
