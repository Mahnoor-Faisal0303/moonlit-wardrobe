import type { Metadata } from "next";
import { Suspense } from "react";
import ExploreGrid from "@/components/ExploreGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { exploreTabs } from "@/data/content";

export const metadata: Metadata = { title: "Explore Collections — Moonlit Wardrobe" };

type SearchParams = Promise<{ category?: string | string[]; q?: string | string[] }>;

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

async function Grid({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requested = first(params.category);
  const initial = requested && exploreTabs.includes(requested) ? requested : "3PC";
  const query = first(params.q) ?? "";
  return <ExploreGrid key={query} initialCategory={initial} query={query} />;
}

export default function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <Navbar />
      <main className="container-x pt-24 pb-20">
        <h1 className="text-center text-4xl font-bold md:text-6xl">Explore Collections</h1>
        <Suspense fallback={<div className="mt-14 h-96 animate-pulse rounded-lg bg-surface-strong" aria-busy />}>
          <Grid searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
