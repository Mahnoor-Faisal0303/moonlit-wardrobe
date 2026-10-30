import Link from "next/link";
import { footerCols, socials, tagline } from "@/data/content";
import { ButtonLink } from "./ui";

export function Cta() {
  return (
    <section className="container-x py-12">
      <div className="rounded-2xl bg-gradient-to-b from-primary to-[#4c1d95] px-6 py-14 text-center shadow-card">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Find Your Perfect<br />Outfit Today</h2>
        <ButtonLink href="/explore" variant="ghost" className="mt-6 !bg-white/20 !text-white">Shop Now</ButtonLink>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-footer">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div>
          <span className="text-lg font-bold text-primary">Moonlit Wardrobe</span>
          <p className="mt-3 max-w-[14rem] text-[10px] text-muted">{tagline}</p>
        </div>
        {footerCols.map((c) => (
          <div key={c.title}>
            <h5 className="text-xs font-semibold">{c.title}</h5>
            <ul className="mt-3 space-y-2 text-[10px] text-muted">{c.links.map((l) => <li key={l.label}><Link href={l.href} className="hover:text-fg">{l.label}</Link></li>)}</ul>
          </div>
        ))}
        <div>
          <h5 className="text-xs font-semibold">Contact</h5>
          <ul className="mt-3 space-y-2 text-[10px] text-muted">
            <li><a href="tel:03198972882" className="hover:text-fg">0319 8972882</a></li>
            <li><a href="mailto:faisalmahnoor86@gmail.com" className="break-all hover:text-fg">faisalmahnoor86@gmail.com</a></li>
          </ul>
          <div className="mt-4 flex gap-4 text-muted">{socials.map((s) => <a key={s} href="#" aria-label={s} className="flex h-5 w-5 items-center justify-center rounded bg-surface-strong text-[9px] uppercase hover:text-fg">{s[0]}</a>)}</div>
        </div>
      </div>
    </footer>
  );
}
