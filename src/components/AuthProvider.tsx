"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

type AuthUser = { userId: string; email?: string; name?: string };

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u ? { userId: u.uid, email: u.email ?? undefined, name: u.displayName ?? undefined } : null);
      setLoading(false);
    });
  }, []);

  const signOut = useCallback(() => firebaseSignOut(getFirebaseAuth()), []);

  const value = useMemo(() => ({ user, loading, signOut }), [user, loading, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
