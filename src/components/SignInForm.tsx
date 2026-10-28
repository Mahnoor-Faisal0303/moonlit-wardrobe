"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FacebookAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { authErrorMessage } from "@/lib/auth-errors";
import { NOT_CONFIGURED_MESSAGE, getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { AuthCard, FormError, fieldClass } from "./auth-ui";
import PasswordField from "./PasswordField";
import { Button } from "./ui";

const social = "flex w-full items-center justify-center gap-4 rounded-full py-5 text-base font-medium transition-opacity hover:opacity-90 disabled:opacity-60";

function GoogleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6Z" />
      <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1Z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48Z" />
    </svg>
  );
}

type Provider = "Google" | "Facebook" | "Apple";

export default function SignInForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step === "email") {
      setStep("password");
      return;
    }
    if (!isFirebaseConfigured) return setError(NOT_CONFIGURED_MESSAGE);

    setBusy(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
      router.replace("/");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const withProvider = async (provider: Provider) => {
    setError(null);
    if (!isFirebaseConfigured) return setError(NOT_CONFIGURED_MESSAGE);
    const p = provider === "Google" ? new GoogleAuthProvider() : provider === "Facebook" ? new FacebookAuthProvider() : new OAuthProvider("apple.com");
    try {
      await signInWithPopup(getFirebaseAuth(), p);
      router.replace("/");
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  return (
    <AuthCard onSubmit={submit}>
      <h1 className="text-3xl font-bold">Sign In</h1>
      <p className="mt-10 text-sm">
        New user? <Link href="/signup" className="text-accent hover:underline">Create an account</Link>
      </p>

      <input
        type="email"
        required
        autoComplete="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        readOnly={step === "password"}
        className={`${fieldClass} mt-14`}
      />
      {step === "password" && (
        <>
          <PasswordField
            required
            autoFocus
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-10"
          />
          <div className="mt-3 flex justify-between text-xs">
            <button type="button" onClick={() => { setStep("email"); setPassword(""); setError(null); }} className="text-muted hover:text-fg">Change email</button>
            <Link href="/forgot-password" className="text-accent hover:underline">Forgot password?</Link>
          </div>
        </>
      )}
      <FormError message={error} />
      <div className="mt-3 flex justify-end">
        <Button type="submit" disabled={busy} className="rounded-full !bg-gradient-to-r !from-primary !to-[#9333ea] !px-6 !py-2 !text-sm disabled:opacity-60">
          {busy ? "Signing in…" : step === "email" ? "Continue" : "Sign In"}
        </Button>
      </div>

      <p className="my-12 text-center text-sm">Or</p>

      <div className="space-y-6">
        <button type="button" onClick={() => withProvider("Google")} className={`${social} border border-line text-fg hover:bg-primary-soft`}>
          <GoogleIcon /> Continue With Google
        </button>
        <button type="button" onClick={() => withProvider("Facebook")} className={`${social} bg-[#1877f2] text-white`}>
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="12" fill="#fff" /><path fill="#1877f2" d="M16.7 15.5l.5-3.5h-3.3V9.8c0-1 .5-1.9 2-1.9h1.5V4.9s-1.4-.2-2.700-.2c-2.800 0-4.600 1.700-4.600 4.700V12H7v3.500h3.100V24h3.800v-8.500h2.800Z" /></svg>
          Continue With Facebook
        </button>
        <button type="button" onClick={() => withProvider("Apple")} className={`${social} bg-[#1c1c1c] text-white`}>
          <svg width="26" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M16.4 12.7c0-2.400 2-3.500 2.100-3.600-1.100-1.700-2.900-1.900-3.500-1.900-1.500-.2-2.900.9-3.700.9-.8 0-1.900-.9-3.200-.8-1.600 0-3.100 1-4 2.400-1.700 3-.4 7.400 1.200 9.800.8 1.200 1.800 2.500 3 2.400 1.200 0 1.700-.8 3.100-.8 1.500 0 1.900.8 3.200.8 1.300 0 2.100-1.200 2.900-2.300.9-1.300 1.300-2.600 1.300-2.700 0 0-2.400-.9-2.400-3.700ZM14 5.600c.7-.8 1.100-1.900 1-3-.9 0-2.100.6-2.800 1.400-.6.700-1.100 1.800-1 2.900 1.100.1 2.100-.5 2.800-1.300Z" /></svg>
          Continue With Apple
        </button>
      </div>
    </AuthCard>
  );
}
