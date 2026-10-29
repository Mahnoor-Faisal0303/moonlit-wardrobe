"use client";

import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";

type CheckState = {
  uid: string | null;
  isAdmin: boolean;
  /** Firestore error code when the check itself failed (e.g. permission-denied). */
  errorCode?: string;
};

/**
 * An admin is a signed-in user with a document at `admins/{uid}`.
 * The same check is enforced server-side by firestore.rules and storage.rules,
 * so this only decides what the UI shows.
 */
export function useIsAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<CheckState>({ uid: null, isAdmin: false });
  const uid = user?.userId ?? null;

  useEffect(() => {
    if (!uid || !isFirebaseConfigured) return;
    let cancelled = false;
    getDoc(doc(getDb(), "admins", uid))
      .then((snap) => !cancelled && setState({ uid, isAdmin: snap.exists() }))
      .catch((err) => !cancelled && setState({ uid, isAdmin: false, errorCode: (err as { code?: string }).code ?? "unknown" }));
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const checked = !uid || state.uid === uid;
  return {
    isAdmin: !!uid && state.uid === uid && state.isAdmin,
    loading: authLoading || !checked,
    errorCode: state.uid === uid ? state.errorCode : undefined,
  };
}
