import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import ItemTabs from "@/components/ItemTabs";
import Navbar from "@/components/Navbar";
import { ButtonLink } from "@/components/ui";
import AddToBagButton from "@/components/AddToBagButton";
import { exploreCards, getDiscountPercent, getItemDetails } from "@/data/content";

const findCard = (id: string) => exploreCards.find((c) => String(c.id) === id);

export function generateStaticParams() {
  return exploreCards.map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const card = findCard(id);
  return { title: card ? `${card.name} — Moonlit Wardrobe` : "Item not found — Moonlit Wardrobe" };
}

type Params = Promise<{ id: string }>;

export default function ExploreItemPage({ params }: { params: Params }) {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <ButtonLink href="/explore" variant="ghost">← Back to Explore</ButtonLink>
        <Suspense fallback={<ItemSkeleton />}>
          <ItemDetails params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ItemSkeleton() {
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

async function ItemDetails({ params }: { params: Params }) {
  const { id } = await params;
  const card = findCard(id);
  if (!card) notFound();

  const discountPercent = getDiscountPercent(card.price, card.discountedPrice);
  const { pieces } = getItemDetails(card.id, card.category);
  const sku = `MW${card.category.replace(/\s/g, "").toUpperCase()}${String(card.id + 1).padStart(3, "0")}`;
  // One sample photo for now: full view plus three crops so the gallery has variety.
  const photos = [
    "object-cover object-top",
    "-scale-x-100 object-cover object-top",
    "scale-[1.8] object-cover object-top",
    "scale-[1.8] object-cover object-bottom",
  ];
  const label = `Unstitched ${pieces.length}-Piece`;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid grid-cols-2 gap-1">
        {photos.map((fit, i) => (
          <div key={i} className="relative aspect-[3/4] overflow-hidden bg-surface-strong">
            <Image src="/items/suit.png" alt={`${card.name} photo ${i + 1}`} fill sizes="(min-width: 1024px) 35vw, 50vw" priority={i < 2} className={fit} />
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
