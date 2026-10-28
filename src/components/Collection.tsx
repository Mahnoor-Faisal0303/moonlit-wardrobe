"use client";

import { useState } from "react";
import { collection, features, tabs } from "@/data/content";
import ProductCard from "./ProductCard";
import { SectionTitle } from "./ui";

const icons = {
  tag: <path d="M3 12V4h8l10 10-8 8L3 12Zm5-5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />,
  leaf: <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />,
  swap: <path d="M4 8h14l-4-4M20 16H6l4 4" />,
};

export default function Collection() {
  const [tab, setTab] = useState(0);
  return (
    <section className="container-x py-12">
      <SectionTitle title="All Collection" subtitle="Worlds First Layer 2 Fashion Marketplace" />
      <div className="mb-12 grid gap-8 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center gap-3 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">{icons[f.icon]}</svg>
            <span className="text-[11px] text-muted">{f.title}</span>
          </div>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2 rounded-lg border border-line bg-surface p-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 rounded-md px-3 py-1.5 text-[10px] transition-colors ${i === tab ? "bg-primary text-primary-fg" : "text-muted hover:bg-primary-soft"}`}
          >{t}</button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collection.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
