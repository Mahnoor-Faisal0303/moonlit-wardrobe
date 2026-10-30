"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { Button } from "./ui";

export default function AddToBagButton({ id }: { id: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <div className="mt-6">
      <Button
        onClick={() => {
          add(id);
          setAdded(true);
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
