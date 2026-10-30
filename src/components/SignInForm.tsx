"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authErrorField, authErrorMessage } from "@/lib/auth-errors";
import { NOT_CONFIGURED_MESSAGE, getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { validateEmail } from "@/lib/validation";
import { useAuth } from "./AuthProvider";
import { AuthCard, FormError } from "./auth-ui";
import { TextField } from "./fields";
import PasswordField from "./PasswordField";
import SocialButtons from "./SocialButtons";
import { Button } from "./ui";

export default function SignInForm() {
  const router = useRouter();
  const { user } = useAuth();
  const submitting = useRef(false);
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace(user.emailVerified ? "/" : "/verify-email");
  }, [user, router]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting.current) return;
    setFormError(null);
    setEmailError(null);
    setPasswordError(null);

    const emailProblem = validateEmail(email.trim());
    if (emailProblem) {
      setEmailError(emailProblem);
      (e.currentTarget.elements.namedItem("email") as HTMLElement | null)?.focus();
      return;
    }
    if (step === "email") return setStep("password");
    if (!password) return setPasswordError("Please enter your password.");
    if (!isFirebaseConfigured) return setFormError(NOT_CONFIGURED_MESSAGE);

    submitting.current = true;
    setBusy(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
      router.replace("/");
    } catch (err) {
      const message = authErrorMessage(err);
      const field = authErrorField(err);
      if (message && field === "email") setEmailError(message);
      else if (message && field === "password") setPasswordError(message);
      else setFormError(message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <AuthCard onSubmit={submit}>
      <h1 className="text-3xl font-bold">Sign In</h1>
      <p className="mt-8 text-sm">
        New user? <Link href="/signup" className="text-accent hover:underline">Create an account</Link>
      </p>

      <TextField
        className="mt-8"
        name="email"
        type="email"
        label="Email Address"
        autoComplete="email"
        value={email}
        readOnly={step === "password"}
        error={emailError}
        onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
      />
      {step === "password" && (
        <>
          <PasswordField
            autoFocus
            name="password"
            label="Password"
            autoComplete="current-password"
            value={password}
            error={passwordError}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
          />
          <div className="flex justify-between text-xs">
            <button type="button" onClick={() => { setStep("email"); setPassword(""); setPasswordError(null); setFormError(null); }} className="min-h-11 text-muted hover:text-fg">
              Change email
            </button>
            <Link href="/forgot-password" className="flex min-h-11 items-center text-accent hover:underline">Forgot password?</Link>
          </div>
        </>
      )}
      <FormError message={formError} />
      <div className="flex justify-end">
        <Button type="submit" loading={busy} className="min-h-11 rounded-full !bg-gradient-to-r !from-primary !to-[#9333ea] !px-8 !text-sm">
          {busy ? "Signing in…" : step === "email" ? "Continue" : "Sign In"}
        </Button>
      </div>

      <p className="my-8 text-center text-sm">Or</p>
      <SocialButtons onError={setFormError} />
    </AuthCard>
  );
}
