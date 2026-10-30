"use client";

import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_IMAGE, priceToNumber } from "@/data/content";
import { useItems } from "./ItemsProvider";
import { useCart } from "./CartProvider";
import { Button, ButtonLink } from "./ui";

const formatRs = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;

export default function BagView() {
  const { lines, setQty, remove, clear } = useCart();
  const { items: catalog, loaded } = useItems();

  const items = lines.flatMap((l) => {
    const card = catalog.find((c) => c.id === l.id);
    return card ? [{ card, size: l.size, qty: l.qty, unit: priceToNumber(card.discountedPrice ?? card.price) }] : [];
  });
  const subtotal = items.reduce((sum, i) => sum + i.unit * i.qty, 0);

  if (!loaded && lines.length > 0 && items.length === 0) {
    return <div className="mt-10 h-48 animate-pulse rounded-lg bg-surface-strong" aria-busy />;
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center">
        <p className="text-sm text-muted">Your bag is empty.</p>
        <ButtonLink href="/explore" className="mt-5">Continue shopping</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
      <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
        {items.map(({ card, size, qty, unit }) => (
          <li key={`${card.id}|${size ?? ""}`} className="flex gap-4 p-4">
            <Link href={`/explore/${card.id}`} className="relative h-28 w-20 shrink-0 overflow-hidden rounded bg-surface-strong">
              <Image src={card.images[0] ?? PLACEHOLDER_IMAGE} alt={card.name} fill sizes="80px" className="object-cover object-top" />
            </Link>
            <div className="flex flex-1 flex-col">
              <Link href={`/explore/${card.id}`} className="text-sm font-semibold uppercase tracking-wide text-fg hover:text-accent">{card.name}</Link>
              <span className="mt-1 text-xs text-muted">{card.category}{size && ` · Size ${size}`}</span>
              <span className="mt-2 text-sm font-medium text-accent">{formatRs(unit)}</span>
              <div className="mt-auto flex items-center gap-3 pt-3">
                <div className="flex items-center rounded-md border border-line text-sm">
                  <button onClick={() => setQty(card.id, size, qty - 1)} aria-label="Decrease quantity" className="px-3 py-1 text-muted hover:text-fg">−</button>
                  <span className="min-w-6 text-center text-fg">{qty}</span>
                  <button onClick={() => setQty(card.id, size, qty + 1)} aria-label="Increase quantity" className="px-3 py-1 text-muted hover:text-fg">+</button>
                </div>
                <button onClick={() => remove(card.id, size)} aria-label={`Remove ${card.name} from bag`} title="Remove" className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger/15 hover:text-danger">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
            <span className="text-sm font-semibold text-fg">{formatRs(unit * qty)}</span>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-lg border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-fg">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm text-muted">
          <span>Subtotal</span>
          <span className="text-fg">{formatRs(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-muted">
          <span>Delivery</span>
          <span>Calculated at checkout</span>
        </div>
        <Button className="mt-6 w-full !py-3">CHECKOUT</Button>
        <button onClick={clear} className="mt-3 w-full text-xs text-muted hover:text-fg">Clear bag</button>
      </aside>
    </div>
  );
}
