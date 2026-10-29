import { exploreCards } from "@/data/content";
import ExploreCard from "./ExploreCard";
import { ButtonLink, SectionTitle } from "./ui";

export default function OnSale() {
  const sale = exploreCards.filter((c) => c.discountedPrice);
  return (
    <section id="sale" className="container-x scroll-mt-20 py-12">
      <SectionTitle title="On Sale" subtitle="Limited-time prices on our favourite pieces." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sale.map((c) => <ExploreCard key={c.id} {...c} />)}
      </div>
      <div className="mt-10 text-center"><ButtonLink href="/explore" variant="outline">View all items</ButtonLink></div>
    </section>
  );
}
