"use client";

import { useState } from "react";

type Piece = { title: string; line: string; fabric: string; colour: string };

export default function ItemTabs({ pieces, description, label }: { pieces: Piece[]; description: string; label: string }) {
  const [tab, setTab] = useState<"details" | "description">("details");
  const tabClass = (active: boolean) =>
    `text-base transition-colors ${active ? "text-fg underline underline-offset-4" : "text-muted hover:text-fg"}`;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-4">
        <button onClick={() => setTab("details")} className={tabClass(tab === "details")}>DETAILS</button>
        <span className="h-4 w-px bg-line" />
        <button onClick={() => setTab("description")} className={tabClass(tab === "description")}>DESCRIPTION</button>
      </div>

      {tab === "details" ? (
        <div className="mt-6 space-y-5 text-sm leading-7 text-fg/80">
          <p>{label}</p>
          {pieces.map((p) => (
            <div key={p.title}>
              <p>{p.title}</p>
              <p>{p.line}</p>
              <p>Fabric: {p.fabric}</p>
              <p>Colour: {p.colour}</p>
            </div>
          ))}
          <p className="text-xs uppercase text-muted">Note: actual product colour may vary slightly from the image.</p>
        </div>
      ) : (
        <p className="mt-6 text-sm leading-7 text-fg/80">{description}</p>
      )}
    </div>
  );
}
