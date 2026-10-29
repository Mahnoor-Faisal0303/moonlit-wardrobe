"use client";

import Image from "next/image";
import { getDiscountPercent, getItemDetails, PLACEHOLDER_IMAGE } from "@/data/content";
import AddToBagButton from "./AddToBagButton";
import { useItems } from "./ItemsProvider";
import ItemTabs from "./ItemTabs";
import { ButtonLink } from "./ui";

export function ItemSkeleton() {
  return (
    <div className="mt-8 grid animate-pulse gap-8 lg:grid-cols-[1fr_380px]" aria-busy>
      <div className="grid grid-cols-2 gap-1">
        {[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[3/4] bg-surface-strong" />)}
      </div>
      <div className="space-y-4">
        <div className="h-7 w-3/4 rounded bg-surface-strong" />
        <div className="h-6 w-24 rounded bg-surface-strong" />
        <div className="h-12 rounded bg-surface-strong" />
        <div className="h-40 rounded bg-surface-strong" />
      </div>
    </div>
  );
}

// Sample items share one photo, so show it in full plus three crops to give the gallery some variety.
const SAMPLE_CROPS = [
  "object-cover object-top",
  "-scale-x-100 object-cover object-top",
  "scale-[1.8] object-cover object-top",
  "scale-[1.8] object-cover object-bottom",
];

export default function ItemDetail({ id }: { id: string }) {
  const { items, loaded } = useItems();
  const card = items.find((c) => c.id === id);

  if (!card) {
    if (!loaded) return <ItemSkeleton />;
    return (
      <div className="mt-16 text-center">
        <h1 className="text-2xl font-semibold">Item not found</h1>
        <p className="mt-2 text-sm text-muted">This item may have been removed.</p>
        <ButtonLink href="/explore" className="mt-6">Back to Explore</ButtonLink>
      </div>
    );
  }

  const discountPercent = getDiscountPercent(card.price, card.discountedPrice);
  const { pieces } = getItemDetails(card);
  const sku = card.custom
    ? `MW-${card.id.slice(0, 6).toUpperCase()}`
    : `MW${card.category.replace(/\s/g, "").toUpperCase()}${String(Number(card.id) + 1).padStart(3, "0")}`;
  const label = `Unstitched ${pieces.length}-Piece`;

  const photos = card.images.length
    ? card.images.map((src) => ({ src, fit: "object-cover object-top" }))
    : SAMPLE_CROPS.map((fit) => ({ src: PLACEHOLDER_IMAGE, fit }));

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className={`grid gap-1 ${photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
        {photos.map((p, i) => (
          <div key={i} className="relative aspect-[3/4] overflow-hidden bg-surface-strong">
            <Image src={p.src} alt={`${card.name} photo ${i + 1}`} fill sizes="(min-width: 1024px) 35vw, 50vw" priority={i < 2} className={p.fit} />
          </div>
        ))}
      </div>

      <div>
        <h1 className="text-xl font-semibold uppercase tracking-wide text-fg">{card.name}</h1>

        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <span className="text-lg font-medium text-accent">Rs. {card.discountedPrice ?? card.price}</span>
          {card.discountedPrice && <span className="text-sm text-muted line-through">Rs. {card.price}</span>}
          {discountPercent > 0 && (
            <span className="rounded bg-danger/15 px-2 py-0.5 text-xs font-semibold text-danger">{discountPercent}% OFF</span>
          )}
        </div>
        <p className="mt-3 text-[11px] text-muted">SKU: {sku}</p>

        <AddToBagButton id={card.id} />

        <ItemTabs pieces={pieces} description={card.description} label={label} />
      </div>
    </div>
  );
}
