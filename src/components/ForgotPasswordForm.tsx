"use client";

import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { authErrorMessage } from "@/lib/auth-errors";
import { NOT_CONFIGURED_MESSAGE, getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { AuthCard, FormError, FormNotice, fieldClass } from "./auth-ui";
import { Button } from "./ui";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isFirebaseConfigured) return setError(NOT_CONFIGURED_MESSAGE);
    setBusy(true);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
      setSent(true);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard onSubmit={submit}>
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <p className="mt-10 text-sm">
        Remembered it? <Link href="/signin" className="text-accent hover:underline">Sign In</Link>
      </p>
      <input
        type="email"
        required
        placeholder="Email Address"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`${fieldClass} mt-12`}
      />
      <FormError message={error} />
      <FormNotice message={sent ? "If an account exists for that email, a reset link is on its way." : null} />
      <div className="mt-10 flex justify-end">
        <Button type="submit" disabled={busy} className="rounded-full !bg-gradient-to-r !from-primary !to-[#9333ea] !px-7 !py-3 !text-base disabled:opacity-60">
          {busy ? "Sending…" : "Send Reset Link"}
        </Button>
      </div>
    </AuthCard>
  );
}
