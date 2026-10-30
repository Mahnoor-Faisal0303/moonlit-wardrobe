"use client";

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
};

const STORAGE_KEY = "bag";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const add = useCallback((id: string, size?: string) => {
    setLines((prev) =>
      prev.some((l) => isLine(l, id, size))
        ? prev.map((l) => (isLine(l, id, size) ? { ...l, qty: l.qty + 1 } : l))
        : [...prev, { id, ...(size ? { size } : {}), qty: 1 }],
    );
  }, []);

  const setQty = useCallback((id: string, size: string | undefined, qty: number) => {
    setLines((prev) => (qty < 1 ? prev.filter((l) => !isLine(l, id, size)) : prev.map((l) => (isLine(l, id, size) ? { ...l, qty } : l))));
  }, []);

  const remove = useCallback((id: string, size?: string) => setLines((prev) => prev.filter((l) => !isLine(l, id, size))), []);
  const clear = useCallback(() => setLines([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({ lines, count: lines.reduce((n, l) => n + l.qty, 0), drawerOpen, openDrawer, closeDrawer, add, setQty, remove, clear }),
    [lines, drawerOpen, openDrawer, closeDrawer, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
