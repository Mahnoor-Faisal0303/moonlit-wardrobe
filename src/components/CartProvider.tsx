"use client";

import { useItems } from "./ItemsProvider";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/** A line is one item in one size; the same item in two sizes is two lines. */
export type CartLine = { id: string; size?: string; qty: number };

const isLine = (l: CartLine, id: string, size?: string) => l.id === id && l.size === size;

type CartContextValue = {
  lines: CartLine[];
  count: number;
  /** The slide-in bag shown after adding an item. */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (id: string, size?: string) => void;
  setQty: (id: string, size: string | undefined, qty: number) => void;
  remove: (id: string, size?: string) => void;
  clear: () => void;
  /** Most units of an item the customer can have in the bag (Infinity when its stock is not tracked). */
  maxQty: (id: string) => number;
};

const STORAGE_KEY = "bag";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { items } = useItems();

  const maxQty = useCallback((id: string) => items.find((i) => i.id === id)?.stock ?? Infinity, [items]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLines((JSON.parse(saved) as CartLine[]).map((l) => ({ ...l, id: String(l.id) })));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  /** Units of an item across all its sizes, since they share one stock count. */
  const inBag = (lines: CartLine[], id: string) => lines.reduce((n, l) => (l.id === id ? n + l.qty : n), 0);

  const add = useCallback((id: string, size?: string) => {
    setLines((prev) => {
      if (inBag(prev, id) >= maxQty(id)) return prev;
      return prev.some((l) => isLine(l, id, size))
        ? prev.map((l) => (isLine(l, id, size) ? { ...l, qty: l.qty + 1 } : l))
        : [...prev, { id, ...(size ? { size } : {}), qty: 1 }];
    });
  }, [maxQty]);

  const setQty = useCallback((id: string, size: string | undefined, qty: number) => {
    setLines((prev) => {
      if (qty < 1) return prev.filter((l) => !isLine(l, id, size));
      const current = prev.find((l) => isLine(l, id, size))?.qty ?? 0;
      // Other sizes of the same item use up part of the stock too.
      const allowed = Math.max(current, maxQty(id) - (inBag(prev, id) - current));
      return prev.map((l) => (isLine(l, id, size) ? { ...l, qty: Math.min(qty, allowed) } : l));
    });
  }, [maxQty]);

  const remove = useCallback((id: string, size?: string) => setLines((prev) => prev.filter((l) => !isLine(l, id, size))), []);
  const clear = useCallback(() => setLines([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({ lines, count: lines.reduce((n, l) => n + l.qty, 0), drawerOpen, openDrawer, closeDrawer, add, setQty, remove, clear, maxQty }),
    [lines, drawerOpen, openDrawer, closeDrawer, add, setQty, remove, clear, maxQty],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
