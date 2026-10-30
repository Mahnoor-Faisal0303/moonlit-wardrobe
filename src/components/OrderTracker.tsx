"use client";

import { doc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatRs } from "@/data/content";
import { getDb, isFirebaseConfigured, NOT_CONFIGURED_MESSAGE } from "@/lib/firebase";
import { orderFromDoc, orderNumber, type Order } from "@/lib/orders";
import OrderTimeline from "./OrderTimeline";
import { ButtonLink } from "./ui";

/** Live status page of one order. Whoever has the order's tracking code can open it. */
export default function OrderTracker({ id }: { id: string }) {
  // undefined while loading, null when there is no such order
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onSnapshot(
      doc(getDb(), "orders", id),
      (snap) => setOrder(snap.exists() ? orderFromDoc(snap.id, snap.data()) : null),
      () => setOrder(null),
    );
  }, [id]);

  if (!isFirebaseConfigured) {
    return <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center text-sm text-muted">{NOT_CONFIGURED_MESSAGE}</div>;
  }
  if (order === undefined) return <div className="mt-10 h-64 animate-pulse rounded-lg bg-surface-strong" aria-busy />;
  if (order === null) {
    return (
      <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center">
        <p className="text-sm text-muted">We could not find an order with this tracking code. Please check the code and try again.</p>
        <ButtonLink href="/orders" className="mt-5">Back to my orders</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="text-lg font-semibold text-fg">Order {orderNumber(order.id)}</h2>
        {order.createdAt && <span className="text-xs text-muted">Placed on {order.createdAt.toLocaleDateString(undefined, { dateStyle: "long" })}</span>}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <section className="h-fit rounded-lg border border-line bg-surface p-6">
          <h3 className="mb-5 text-base font-semibold text-fg">Order status</h3>
          <OrderTimeline order={order} />
        </section>

        <div className="space-y-6">
          <section className="rounded-lg border border-line bg-surface p-6">
            <h3 className="text-base font-semibold text-fg">Items</h3>
            <ul className="mt-3 divide-y divide-line text-sm">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-4 py-2.5">
                  <span className="min-w-0 text-fg">
                    {i.id ? <Link href={`/explore/${i.id}`} className="hover:text-accent">{i.name}</Link> : i.name}
                    <span className="text-muted">{i.size && ` · Size ${i.size}`} · Qty {i.qty}</span>
                  </span>
                  <span className="shrink-0 text-fg">{formatRs(i.unitPrice * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-sm font-semibold text-fg">
              <span>Total <span className="font-normal text-muted">· Cash on delivery</span></span>
              <span>{formatRs(order.subtotal)}</span>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-surface p-6 text-sm text-muted">
            <h3 className="text-base font-semibold text-fg">Delivery details</h3>
            <p className="mt-3 text-fg">{order.name}</p>
            <p>{order.address}</p>
            <p>{order.city}{order.postalCode && `, ${order.postalCode}`}</p>
            <p className="mt-2">{order.phone}</p>
            {order.notes && <p className="mt-2 italic">&ldquo;{order.notes}&rdquo;</p>}
          </section>
        </div>
      </div>
    </div>
  );
}
