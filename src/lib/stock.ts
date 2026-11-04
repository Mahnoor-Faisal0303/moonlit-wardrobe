import { doc, type Transaction } from "firebase/firestore";
import type { OrderItem } from "./orders";
import { getDb } from "./firebase";

/** Units per item id, adding up every size of the same item (they share one stock count). */
export function unitsById(items: Pick<OrderItem, "id" | "qty">[]) {
  const units = new Map<string, number>();
  for (const i of items) units.set(i.id, (units.get(i.id) ?? 0) + i.qty);
  return units;
}

export class OutOfStockError extends Error {}

/**
 * Moves stock by `sign * units` for each item inside a transaction. Items without a stock count
 * (built-in items, or items added before stock tracking) are left alone.
 * With sign -1 (a sale) it throws OutOfStockError when there is not enough; with +1 (a return) it never fails.
 */
export async function adjustStock(tx: Transaction, items: Pick<OrderItem, "id" | "name" | "qty">[], sign: 1 | -1) {
  const db = getDb();
  const names = new Map(items.map((i) => [i.id, i.name]));
  const entries = [...unitsById(items)].map(([id, qty]) => ({ id, qty, ref: doc(db, "items", id) }));
  // A transaction must read everything before it writes anything.
  const snaps = await Promise.all(entries.map((e) => tx.get(e.ref)));
  entries.forEach((e, i) => {
    const stock = snaps[i].data()?.stock;
    if (typeof stock !== "number") return;
    if (sign === -1 && stock < e.qty) {
      throw new OutOfStockError(stock === 0 ? `"${names.get(e.id)}" just sold out.` : `Only ${stock} of "${names.get(e.id)}" left.`);
    }
    tx.update(e.ref, { stock: Math.max(0, stock + sign * e.qty) });
  });
}
