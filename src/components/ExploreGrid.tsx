"use client";

import { useState } from "react";
import { exploreCards, exploreTabs } from "@/data/content";
import ExploreCard from "./ExploreCard";

export default function ExploreGrid() {
  const [tab, setTab] = useState(0);
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
        {exploreCards.map((c) => <ExploreCard key={c.id} banner={c.banner} avatar={c.avatar} />)}
      </div>
    </>
  );
}
