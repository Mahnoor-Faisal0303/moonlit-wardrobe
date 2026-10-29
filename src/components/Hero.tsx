import Image from "next/image";
import { exploreCards, exploreTabs } from "@/data/content";
import { ButtonLink } from "./ui";

const stats = [
  { value: `${exploreCards.length}+`, label: "Designs" },
  { value: String(exploreTabs.length), label: "Collections" },
  { value: "3–5 days", label: "Delivery" },
];

const photos = [
  { fit: "object-cover object-top", span: "row-span-2" },
  { fit: "scale-[1.8] object-cover object-top", span: "" },
  { fit: "scale-[1.8] object-cover object-bottom", span: "" },
];

export default function Hero() {
  return (
    <section className="container-x pt-12 pb-12">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">New season collection</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">Dress in the<br />Spirit of Fashion</h1>
          <p className="mt-4 max-w-sm text-xs leading-6 text-muted">
            Unstitched suits, everyday casuals and statement formals. Find the outfit that suits your moment.
          </p>
          <div className="mt-6 flex gap-3">
            <ButtonLink href="/explore">Shop Now</ButtonLink>
            <ButtonLink href="/#sale" variant="outline">View Sale</ButtonLink>
          </div>
          <dl className="mt-10 flex gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-lg font-semibold">{s.value}</dt>
                <dd className="text-[10px] text-subtle">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid h-96 grid-cols-2 grid-rows-2 gap-2.5 md:h-[28rem]">
          {photos.map((p, i) => (
            <div key={i} className={`relative overflow-hidden rounded-lg bg-surface-strong ${p.span}`}>
              <Image src="/items/suit.png" alt="Printed three piece suit" fill priority={i === 0} sizes="(min-width: 1024px) 25vw, 50vw" className={p.fit} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
