"use client";

import Link from "next/link";
import { useState } from "react";
import { moreLinks, navLinks } from "@/data/content";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui";

const hrefFor = (l: string) => (l === "Home" ? "/" : l === "Explore" ? "/explore" : "#");

export default function Navbar() {
  const [more, setMore] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-nav backdrop-blur-md">
      <div className="container-x flex h-14 items-center gap-6">
        <Link href="/" className="text-lg font-bold text-primary">Logo</Link>
        <label className="hidden h-8 w-60 items-center gap-2 rounded-full border border-line bg-surface px-3 text-xs text-subtle md:flex">
          <span>⌕</span>
          <input className="w-full bg-transparent outline-none placeholder:text-subtle" placeholder="Search Items, Fashion, Collection and Users" />
        </label>
        <nav className="ml-auto hidden items-center gap-6 text-[11px] text-muted lg:flex">
          {navLinks.map((l) => <Link key={l} href={hrefFor(l)} className="hover:text-fg">{l}</Link>)}
          <div className="relative">
            <button onClick={() => setMore(!more)} className="hover:text-fg">More ▾</button>
            {more && (
              <ul className="absolute right-0 top-8 w-36 rounded-md border border-line bg-base p-3 shadow-card">
                {moreLinks.map((l) => <li key={l} className="py-1.5 text-[10px] text-muted hover:text-fg"><a href="#">{l}</a></li>)}
              </ul>
            )}
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <ThemeToggle />
          <span className="hidden gap-3 text-muted sm:flex" aria-hidden><span>🔔</span><span>💬</span></span>
          <Button variant="outline" className="!border-line !py-1.5 !text-fg">Wallet</Button>
          <span className="h-7 w-7 rounded-full bg-gradient-to-br from-accent to-primary" />
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        </div>
      </div>
      {open && (
        <nav className="container-x flex flex-col gap-3 pb-4 text-sm text-muted lg:hidden">
          {[...navLinks, ...moreLinks].map((l) => <a key={l} href="#">{l}</a>)}
        </nav>
      )}
    </header>
  );
}
