"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useIsAdmin } from "./useIsAdmin";

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isAdmin } = useIsAdmin();

  if (loading) return <span className="h-7 w-7 rounded-full bg-surface-strong" />;
  if (!user) return <Link href="/signin" className="text-[11px] text-muted hover:text-fg">Sign In</Link>;

  const initial = (user.name ?? user.email ?? "?")[0].toUpperCase();
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} aria-label="Account menu" className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-xs font-semibold text-white">
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 top-9 w-52 rounded-md border border-line bg-base p-3 shadow-card">
          <p className="truncate text-[11px] text-muted">{user.email}</p>
          <Link href="/orders" onClick={() => setOpen(false)} className="mt-3 block w-full rounded-md bg-surface-strong py-1.5 text-center text-xs hover:bg-primary-soft">My orders</Link>
          {isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} className="mt-3 block w-full rounded-md bg-primary-soft py-1.5 text-center text-xs text-accent hover:bg-primary hover:text-primary-fg">Admin panel</Link>
          )}
          <button
            onClick={async () => { await signOut(); setOpen(false); router.replace("/signin"); }}
            className="mt-2 w-full rounded-md bg-surface-strong py-1.5 text-xs hover:bg-primary-soft"
          >Sign out</button>
        </div>
      )}
    </div>
  );
}
