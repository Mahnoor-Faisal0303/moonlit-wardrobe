"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

type AuthUser = { userId: string; email?: string; name?: string; emailVerified: boolean };

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  /** Re-reads the user from Firebase (e.g. after they click the verification link). */
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

const toAuthUser = (u: User): AuthUser => ({
  userId: u.uid,
  email: u.email ?? undefined,
  name: u.displayName ?? undefined,
  emailVerified: u.emailVerified,
});

// Pages an unverified user may stay on; everything else sends them to /verify-email.
const UNVERIFIED_ALLOWED = ["/verify-email"];

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u ? toAuthUser(u) : null);
      setLoading(false);
    });
  }, []);

  // Block unverified accounts from the rest of the app.
  useEffect(() => {
    if (user && !user.emailVerified && !UNVERIFIED_ALLOWED.includes(pathname)) router.replace("/verify-email");
  }, [user, pathname, router]);

  const signOut = useCallback(() => firebaseSignOut(getFirebaseAuth()), []);

  const refreshUser = useCallback(async () => {
    const current = getFirebaseAuth().currentUser;
    if (!current) return;
    await current.reload();
    await current.getIdToken(true); // pick up the new email_verified claim
    setUser(toAuthUser(current));
  }, []);

  const value = useMemo(() => ({ user, loading, signOut, refreshUser }), [user, loading, signOut, refreshUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
