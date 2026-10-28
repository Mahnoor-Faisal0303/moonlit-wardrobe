"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { authErrorMessage } from "@/lib/auth-errors";
import { getFirebaseAuth } from "@/lib/firebase";
import { RESEND_COOLDOWN_SECONDS, cooldownRemaining, markEmailSent } from "@/lib/verify-cooldown";
import { useAuth } from "./AuthProvider";
import { AuthCard, FormError, FormNotice } from "./auth-ui";
import { Button } from "./ui";

export default function VerifyEmail() {
  const router = useRouter();
  const { user, loading, refreshUser, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/signin");
    else if (user.emailVerified) router.replace("/");
  }, [user, loading, router]);

  // Re-check when the user comes back from their inbox tab.
  useEffect(() => {
    const onFocus = () => refreshUser().catch(() => {});
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshUser]);

  const check = async () => {
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      await refreshUser();
      if (!getFirebaseAuth().currentUser?.emailVerified) setError("Your email isn't verified yet. Click the link in the email first.");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  // Pick up a cooldown started on the sign-up page (that email was just sent).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCooldown(cooldownRemaining());
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldownRemaining()), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resend = async () => {
    if (cooldown > 0 || resending) return;
    setError(null);
    setNotice(null);
    const current = getFirebaseAuth().currentUser;
    if (!current) return;
    setResending(true);
    try {
      await sendEmailVerification(current);
      markEmailSent();
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setNotice(`Email sent to ${current.email}. Check your inbox (and spam folder).`);
    } catch (err) {
      // Firebase says "too many requests" when we resend too soon: back off instead of letting the user hammer it.
      if ((err as { code?: string }).code === "auth/too-many-requests") {
        markEmailSent();
        setCooldown(RESEND_COOLDOWN_SECONDS);
        setError("We've already sent you an email recently. Please wait before requesting another.");
      } else {
        setError(authErrorMessage(err));
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard onSubmit={(e) => { e.preventDefault(); check(); }}>
      <h1 className="text-3xl font-bold">Check Your Inbox</h1>
      <p className="mt-8 text-sm leading-relaxed text-muted">
        We sent a verification link to <span className="text-fg">{user?.email}</span>. Click it to activate your account, then come back here.
      </p>
      <FormError message={error} />
      <FormNotice message={notice} />
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0 || resending}
          className="min-h-11 text-sm text-accent hover:underline disabled:cursor-not-allowed disabled:text-subtle disabled:no-underline"
        >
          {resending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
        </button>
        <Button type="submit" loading={busy} className="min-h-12 rounded-full !bg-gradient-to-r !from-primary !to-[#9333ea] !px-7 !text-base">
          {busy ? "Checking…" : "I've verified my email"}
        </Button>
      </div>
      <button type="button" onClick={() => signOut().then(() => router.replace("/signin"))} className="mt-4 min-h-11 text-xs text-muted hover:text-fg">
        Use a different account
      </button>
    </AuthCard>
  );
}
