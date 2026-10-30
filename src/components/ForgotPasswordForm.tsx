"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { authErrorField, authErrorMessage } from "@/lib/auth-errors";
import { NOT_CONFIGURED_MESSAGE, getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { validateEmail } from "@/lib/validation";
import { AuthCard, FormError, FormNotice } from "./auth-ui";
import { TextField } from "./fields";
import { Button } from "./ui";

export default function ForgotPasswordForm() {
  const submitting = useRef(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    setFormError(null);
    setSent(false);
    const problem = validateEmail(email.trim());
    setEmailError(problem);
    if (problem) return;
    if (!isFirebaseConfigured) return setFormError(NOT_CONFIGURED_MESSAGE);

    submitting.current = true;
    setBusy(true);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
      setSent(true);
    } catch (err) {
      const message = authErrorMessage(err);
      if (authErrorField(err) === "email") setEmailError(message);
      else setFormError(message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <AuthCard onSubmit={submit}>
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <p className="mt-8 text-sm">
        Remembered it? <Link href="/signin" className="text-accent hover:underline">Sign In</Link>
      </p>
      <TextField
        className="mt-8"
        name="email"
        type="email"
        label="Email Address"
        autoComplete="email"
        value={email}
        error={emailError}
        onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
      />
      <FormError message={formError} />
      <FormNotice message={sent ? "If an account exists for that email, a reset link is on its way." : null} />
      <div className="flex justify-end">
        <Button type="submit" loading={busy} className="min-h-12 rounded-full !bg-gradient-to-r !from-primary !to-[#9333ea] !px-7 !text-base">
          {busy ? "Sending…" : "Send Reset Link"}
        </Button>
      </div>
    </AuthCard>
  );
}
