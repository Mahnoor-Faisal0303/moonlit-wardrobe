import { lorem, trending } from "@/data/content";
import ProductCard from "./ProductCard";
import { SectionTitle } from "./ui";

export default function Trending() {
  return (
    <section className="container-x py-12">
      <SectionTitle title="New & Trending" subtitle={lorem} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trending.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
