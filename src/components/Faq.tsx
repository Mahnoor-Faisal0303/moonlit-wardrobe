"use client";

import { useState } from "react";
import { faqs } from "@/data/content";
import { SectionTitle } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="container-x scroll-mt-20 py-12">
      <SectionTitle title="Frequently Asked Questions" subtitle="Wanna ask something?" />
      <div className="grid items-start gap-x-10 md:grid-cols-2">
        {faqs.map((f, i) => (
          <div key={f.q} className="border-b border-line">
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between py-5 text-left text-xs text-fg">
              {f.q}<span className="text-muted">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="pb-4 text-[11px] leading-5 text-muted">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
