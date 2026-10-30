"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { formatRs, PLACEHOLDER_IMAGE, priceToNumber } from "@/data/content";
import { useCart } from "./CartProvider";
import { useItems } from "./ItemsProvider";
import { ButtonLink } from "./ui";

/** Slide-in shopping bag, opened when an item is added to the bag. */
export default function CartDrawer() {
  const { lines, drawerOpen: open, closeDrawer, setQty, remove } = useCart();
  const { items: catalog } = useItems();
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Following a link from inside the drawer (or the browser's back button) closes it.
  useEffect(() => closeDrawer(), [pathname, closeDrawer]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeDrawer]);

  const items = lines.flatMap((l) => {
    const card = catalog.find((c) => c.id === l.id);
    return card ? [{ card, size: l.size, qty: l.qty, unit: priceToNumber(card.discountedPrice ?? card.price) }] : [];
  });
  const subtotal = items.reduce((sum, i) => sum + i.unit * i.qty, 0);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        onClick={closeDrawer}
        aria-hidden
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-base shadow-card transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-base font-semibold uppercase tracking-wide text-fg">Shopping bag</h2>
          <button ref={closeRef} onClick={closeDrawer} aria-label="Close bag" className="rounded-md p-1 text-muted transition-colors hover:text-fg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <p className="flex-1 px-6 py-16 text-center text-sm text-muted">Your bag is empty.</p>
        ) : (
          <ul className="flex-1 divide-y divide-line overflow-y-auto">
            {items.map(({ card, size, qty, unit }) => (
              <li key={`${card.id}|${size ?? ""}`} className="flex gap-4 px-6 py-5">
                <Link href={`/explore/${card.id}`} className="relative h-28 w-20 shrink-0 overflow-hidden rounded bg-surface-strong">
                  <Image src={card.images[0] ?? PLACEHOLDER_IMAGE} alt={card.name} fill sizes="80px" className="object-cover object-top" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/explore/${card.id}`} className="text-sm font-semibold uppercase tracking-wide text-fg hover:text-accent">{card.name}</Link>
                  <span className="mt-1 text-xs text-muted">{card.category}{size && ` · Size ${size}`}</span>
                  <span className="mt-1 text-sm font-medium text-accent">{formatRs(unit)}</span>
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
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-line px-6 py-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide text-fg">Subtotal</span>
            <span className="text-lg font-semibold text-fg">{formatRs(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-muted">Delivery is calculated at checkout.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <ButtonLink href="/bag" variant="ghost" className="!py-3 uppercase tracking-wider">View bag</ButtonLink>
            <ButtonLink href="/checkout" className="!py-3 uppercase tracking-wider">Checkout</ButtonLink>
          </div>
          <button onClick={closeDrawer} className="mt-3 w-full rounded-md border border-primary py-3 text-xs font-medium uppercase tracking-wider text-accent transition-colors hover:bg-primary-soft">
            Continue shopping
          </button>
        </div>
      </aside>
    </div>
  );
}
