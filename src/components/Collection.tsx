"use client";

import Image from "next/image";
import Link from "next/link";
import { exploreTabs, PLACEHOLDER_IMAGE } from "@/data/content";
import { useItems } from "./ItemsProvider";
import { SectionTitle } from "./ui";

export default function Collection() {
  const { items } = useItems();
  return (
    <section className="container-x py-12">
      <SectionTitle title="Shop by Category" subtitle="From one-piece kurtas to formal gowns, pick your style." />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {exploreTabs.map((t) => {
          const inCategory = items.filter((c) => c.category === t);
          const count = inCategory.length;
          // The first item of the category, as listed on the explore page, is its cover.
          const cover = inCategory[0]?.images[0] ?? PLACEHOLDER_IMAGE;
          return (
            <Link key={t} href={`/explore?category=${encodeURIComponent(t)}`} className="group relative block aspect-[4/3] overflow-hidden rounded-lg border border-line bg-surface-strong">
              <Image src={cover} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <h3 className="text-base font-semibold">{t}</h3>
                <p className="text-[10px] opacity-80">{count} items</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
