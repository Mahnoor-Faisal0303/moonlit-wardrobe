"use client";

import { useState } from "react";
import { faqs, lorem } from "@/data/content";
import { SectionTitle } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="container-x py-12">
      <SectionTitle title="Frequently Asked Question" subtitle="Wanna Ask Something?" />
      <div className="grid gap-x-10 md:grid-cols-2">
        {faqs.map((q, i) => (
          <div key={i} className="border-b border-line">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between py-5 text-left text-[11px] text-muted">
              {q}<span>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="pb-4 text-[10px] text-subtle">{lorem}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
