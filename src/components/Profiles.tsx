"use client";

import { useState } from "react";
import { brands, creators, lorem } from "@/data/content";
import { Art, Button, SectionTitle, Verified } from "./ui";

type Item = { name: string; hue: [string, string]; followed: boolean; logo?: string };

function FollowCard({ item, brand }: { item: Item; brand?: boolean }) {
  const [followed, setFollowed] = useState(item.followed);
  return (
    <article className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <Art hue={item.hue} className="h-36 sm:h-40">
        {brand && <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">{item.logo}</span>}
      </Art>
      <div className="relative px-5 pb-5 text-center">
        <span className="-mt-6 mb-2 inline-block h-12 w-12 rounded-full border-2 border-base bg-gradient-to-br from-accent to-primary" />
        <h4 className="flex items-center justify-center gap-1 text-xs font-medium">{item.name} <Verified /></h4>
        <p className="mx-auto mt-2 max-w-[14rem] text-[9px] text-muted">{lorem}</p>
        <Button variant={followed ? "outline" : "primary"} className="mt-4 w-full" onClick={() => setFollowed(!followed)}>
          {followed ? "+ Followed" : "+ Follow"}
        </Button>
      </div>
    </article>
  );
}

export function Creators() {
  return (
    <section className="container-x py-12">
      <SectionTitle title="Upcoming Creators" subtitle={lorem} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {creators.map((c, i) => <FollowCard key={i} item={c} />)}
      </div>
    </section>
  );
}

export function Brands() {
  return (
    <section className="container-x py-12">
      <SectionTitle title="Upcoming Brands" subtitle={lorem} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => <FollowCard key={b.name} brand item={{ name: b.name, hue: [b.bg, b.bg], followed: b.followed, logo: b.logo }} />)}
      </div>
    </section>
  );
}
