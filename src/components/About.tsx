import Image from "next/image";
import { ButtonLink, SectionTitle } from "./ui";

export default function About() {
  return (
    <section id="about" className="container-x scroll-mt-20 py-12">
      <SectionTitle title="About Us" subtitle="Moonlit Wardrobe is a fashion label for every occasion." />
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-strong">
          <Image src="/items/suit.png" alt="Moonlit Wardrobe suit" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[50%_25%]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Fashion That Speaks</h3>
          <p className="mt-4 text-xs leading-6 text-muted">
            We design and curate outfits that feel as good as they look. From breathable lawn kurtas for sunny afternoons to hand-embellished formals for the biggest nights, every piece is made with quality fabric and careful finishing.
          </p>
          <p className="mt-3 text-xs leading-6 text-muted">
            Browse by piece count or by occasion, and have your order delivered to your door.
          </p>
          <ButtonLink href="/explore" className="mt-6">Explore the collection</ButtonLink>
        </div>
      </div>
    </section>
  );
}
