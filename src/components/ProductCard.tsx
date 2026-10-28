"use client";

import { useState } from "react";
import type { Product } from "@/data/content";
import { Art, Button, Heart } from "./ui";

export default function ProductCard({ p }: { p: Product }) {
  const [liked, setLiked] = useState(!!p.liked);
  return (
    <article className="rounded-xl border border-line bg-surface p-3 shadow-card">
      <Art hue={p.hue} className="aspect-[4/5] rounded-lg" />
      <div className="mt-3 flex justify-between text-[10px] text-muted"><span>{p.user}</span><span className="text-subtle">Current Bid</span></div>
      <div className="mt-1 flex justify-between text-[10px] font-medium"><span>{p.name}</span><span>{p.bid}</span></div>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={() => setLiked(!liked)} aria-label="Like" aria-pressed={liked} className="text-muted"><Heart filled={liked} /></button>
        <Button className="flex-1">Buy Now</Button>
      </div>
    </article>
  );
}
