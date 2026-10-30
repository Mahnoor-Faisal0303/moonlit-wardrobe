"use client";

import { collection, onSnapshot, orderBy, query, type DocumentData } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { formatPrice, staticItems, type Item, type ItemPiece } from "@/data/content";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

type ItemsState = {
  /** Admin-added items first, then the built-in sample items. */
  items: Item[];
  /** True once the admin-added items have been fetched (or Firebase is unavailable). */
  loaded: boolean;
};

const ItemsContext = createContext<ItemsState | null>(null);

export function useItems() {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error("useItems must be used inside <ItemsProvider>");
  return ctx;
}

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

const piecesFromDoc = (v: unknown): ItemPiece[] | undefined =>
  Array.isArray(v)
    ? v.map((p) => ({ name: str(p?.name) ?? "", length: str(p?.length), fabric: str(p?.fabric), colour: str(p?.colour) }))
    : undefined;

const fromDoc = (id: string, d: DocumentData): Item => ({
  id,
  name: d.name,
  category: d.category,
  price: formatPrice(Number(d.price)),
  discountedPrice: d.discountedPrice ? formatPrice(Number(d.discountedPrice)) : undefined,
  description: d.description ?? "",
  fabric: d.fabric ?? "",
  colour: d.colour ?? "",
  stitching: d.stitching === "Stitched" || d.stitching === "Unstitched" || d.stitching === "none" ? d.stitching : undefined,
  sizes: Array.isArray(d.sizes) ? d.sizes.filter((x: unknown): x is string => typeof x === "string" && x !== "") : undefined,
  pieces: piecesFromDoc(d.pieces),
  note: str(d.note),
  // Only the small cover is on the item document; the full gallery is loaded on the item page.
  images: typeof d.cover === "string" ? [d.cover] : [],
  custom: true,
});

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onSnapshot(
      query(collection(getDb(), "items"), orderBy("createdAt", "desc")),
      (snap) => {
        setCustom(snap.docs.map((d) => fromDoc(d.id, d.data())));
        setLoaded(true);
      },
      // Missing permissions or offline: fall back to the built-in items only.
      () => setLoaded(true),
    );
  }, []);

  const value = useMemo(() => ({ items: [...custom, ...staticItems], loaded }), [custom, loaded]);
  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}
