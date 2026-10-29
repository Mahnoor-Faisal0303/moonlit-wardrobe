"use client";

import Link from "next/link";
import { useState } from "react";
import { exploreCards, exploreTabs } from "@/data/content";
import ExploreCard from "./ExploreCard";

export default function ExploreGrid({ initialCategory = "3PC", query = "" }: { initialCategory?: string; query?: string }) {
  const [tab, setTab] = useState(Math.max(0, exploreTabs.indexOf(initialCategory)));
  const term = query.trim().toLowerCase();

  if (term) {
    const results = exploreCards.filter((c) =>
      [c.name, c.category, c.description].some((f) => f.toLowerCase().includes(term)),
    );
    return (
      <>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {results.length} {results.length === 1 ? "result" : "results"} for <span className="font-semibold text-fg">“{query.trim()}”</span>
          </p>
          <Link href="/explore" className="text-xs text-accent hover:underline">Clear search</Link>
        </div>
        {results.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted">No items match your search. Try another name, category or fabric.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((c) => <ExploreCard key={c.id} {...c} />)}
          </div>
        )}
      </>
    );
  }

  const visibleCards = exploreCards.filter((c) => c.category === exploreTabs[tab]);
  return (
    <>
      <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-6">
        {exploreTabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              i === tab ? "bg-gradient-to-r from-primary to-[#9333ea] text-primary-fg" : "bg-surface-strong text-muted hover:bg-primary-soft"
            }`}
          >{t}</button>
        ))}
      </div>
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map((c) => <ExploreCard key={c.id} {...c} />)}
      </div>
    </>
  );
}
