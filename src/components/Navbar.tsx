"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { moreLinks, navLinks } from "@/data/content";
import { useCart } from "./CartProvider";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const [more, setMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-nav backdrop-blur-md">
      <div className="container-x flex h-14 items-center gap-6">
        <Link href="/" className="text-lg font-bold text-primary">Moonlit Wardrobe</Link>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = query.trim();
            router.push(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
          }}
          className="hidden h-8 w-60 items-center gap-2 rounded-full border border-line bg-surface px-3 text-xs text-subtle focus-within:border-primary md:flex"
        >
          <button type="submit" aria-label="Search" className="hover:text-fg">⌕</button>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search items"
            className="w-full bg-transparent text-fg outline-none placeholder:text-subtle"
            placeholder="Search suits, kurtas and collections"
          />
        </form>
        <nav className="ml-auto hidden items-center gap-6 text-[11px] text-muted lg:flex">
          {navLinks.map((l) => <Link key={l.label} href={l.href} className="hover:text-fg">{l.label}</Link>)}
          <div className="relative">
            <button onClick={() => setMore(!more)} className="hover:text-fg">More ▾</button>
            {more && (
              <ul className="absolute right-0 top-8 w-36 rounded-md border border-line bg-base p-3 shadow-card">
                {moreLinks.map((l) => <li key={l.label} className="py-1.5 text-[10px] text-muted hover:text-fg"><Link href={l.href} onClick={() => setMore(false)}>{l.label}</Link></li>)}
              </ul>
            )}
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <ThemeToggle />
          <Link href="/bag" aria-label={`Bag, ${count} items`} className="relative text-muted hover:text-fg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 7h12l1 14H5L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-fg">{count}</span>
            )}
          </Link>
          <UserMenu />
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        </div>
      </div>
      {open && (
        <nav className="container-x flex flex-col gap-3 pb-4 text-sm text-muted lg:hidden">
          {[...navLinks, ...moreLinks].map((l) => <Link key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
        </nav>
      )}
    </header>
  );
}
