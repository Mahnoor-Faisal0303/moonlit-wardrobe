"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { isFirebaseConfigured, NOT_CONFIGURED_MESSAGE } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { useIsAdmin } from "./useIsAdmin";

const tabs = [
  { href: "/admin", label: "Items" },
  { href: "/admin/orders", label: "Orders" },
];

/**
 * Shared frame of the admin pages. Anyone who is not a signed-in admin is sent away, and the
 * content is never rendered for them. (Firestore rules enforce the same check on the data.)
 */
export default function AdminGate({ children }: { children: (userId: string) => ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useIsAdmin();
  const router = useRouter();
  const pathname = usePathname();

  const checking = authLoading || loading;

  useEffect(() => {
    if (!isFirebaseConfigured || checking) return;
    if (!user) router.replace("/signin");
    else if (!isAdmin) router.replace("/");
  }, [checking, user, isAdmin, router]);

  if (!isFirebaseConfigured) {
    return <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center text-sm text-muted">{NOT_CONFIGURED_MESSAGE}</div>;
  }
  if (checking || !user || !isAdmin) return <div className="mt-10 h-64 animate-pulse rounded-lg bg-surface-strong" aria-busy />;

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Admin</h1>
      <nav aria-label="Admin sections" className="mt-4 flex gap-6 border-b border-line text-sm">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            aria-current={pathname === t.href ? "page" : undefined}
            className={`-mb-px border-b-2 pb-2 transition-colors ${pathname === t.href ? "border-primary text-fg" : "border-transparent text-muted hover:text-fg"}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {children(user.userId)}
    </>
  );
}
