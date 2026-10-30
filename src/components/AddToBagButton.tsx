"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { Button } from "./ui";

export default function AddToBagButton({ id, sizes = [] }: { id: string; sizes?: string[] }) {
  const { add, openDrawer } = useCart();
  const [added, setAdded] = useState(false);
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [needSize, setNeedSize] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <div className="mt-6">
      {sizes.length > 0 && (
        <div role="radiogroup" aria-label="Size" className="mb-4">
          <p className="mb-2 text-xs text-muted">Size{size && `: ${size}`}</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s);
                  setNeedSize(false);
                }}
                className={`min-w-11 rounded-md border px-3 py-2 text-sm transition-colors ${
                  size === s ? "border-primary bg-primary text-primary-fg" : "border-line text-fg hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p role="alert" className="mt-2 h-4 text-xs text-danger">{needSize && "Please choose a size."}</p>
        </div>
      )}
      <Button
        onClick={() => {
          if (sizes.length > 0 && !size) return setNeedSize(true);
          add(id, size ?? undefined);
          setAdded(true);
          openDrawer();
        }}
        className="w-full !py-4 text-sm font-semibold tracking-wider"
      >
        {added ? "ADDED ✓" : "ADD TO BAG"}
      </Button>
      <p aria-live="polite" className="mt-2 h-4 text-xs text-accent">
        {added && (
          <>
            Item added to your bag.{" "}
            <Link href="/bag" className="underline">View bag</Link>
          </>
        )}
      </p>
    </div>
  );
}
