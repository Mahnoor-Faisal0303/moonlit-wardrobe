import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import ItemDetail, { ItemSkeleton } from "@/components/ItemDetail";
import Navbar from "@/components/Navbar";
import { ButtonLink } from "@/components/ui";
import { staticItems } from "@/data/content";

type Params = Promise<{ id: string }>;

// Only the built-in items are prerendered; admin-added items are rendered on demand.
export function generateStaticParams() {
  return staticItems.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const card = staticItems.find((c) => c.id === id);
  return { title: card ? `${card.name} — Moonlit Wardrobe` : "Item — Moonlit Wardrobe" };
}

async function Details({ params }: { params: Params }) {
  const { id } = await params;
  return <ItemDetail id={id} />;
}

export default function ExploreItemPage({ params }: { params: Params }) {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <ButtonLink href="/explore" variant="ghost">← Back to Explore</ButtonLink>
        <Suspense fallback={<ItemSkeleton />}>
          <Details params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
