import Image from "next/image";
import Link from "next/link";
import { getDiscountPercent } from "@/data/content";
import { Verified } from "./ui";

type ExploreCardProps = {
  id: number;
  name: string;
  category: string;
  price: string;
  discountedPrice?: string;
  description: string;
};

export default function ExploreCard({ id, name, category, price, discountedPrice, description }: ExploreCardProps) {
  const discountPercent = getDiscountPercent(price, discountedPrice);
  return (
    <Link href={`/explore/${id}`} className="block">
    <article className="cursor-pointer overflow-hidden rounded-lg border border-line bg-surface shadow-card transition-all duration-300 ease-out hover:z-10 hover:scale-105 hover:border-primary hover:shadow-2xl">
      <div className="relative aspect-[624/756]">
        <Image src="/items/suit.png" alt={name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
      </div>
      <div className="relative flex flex-col items-center px-6 pb-6 text-center">
        <h3 className="mt-5 flex items-center gap-2 text-base font-semibold text-fg">{name} <Verified /></h3>
        <span className="mt-2 rounded-full bg-primary-soft px-3 py-0.5 text-[11px] font-medium text-accent">{category}</span>
        <p className="mt-4 text-xs leading-6 text-fg/80">{description}</p>
        <div className="mt-4 flex items-baseline gap-2 self-start">
          <span className="text-sm font-semibold text-accent">Rs. {discountedPrice ?? price}</span>
          {discountedPrice && <span className="text-xs text-muted line-through">Rs. {price}</span>}
          {discountPercent > 0 && (
            <span className="rounded bg-danger/15 px-1.5 py-0.5 text-[10px] font-semibold text-danger">{discountPercent}% OFF</span>
          )}
        </div>
      </div>
    </article>
    </Link>
  );
}
