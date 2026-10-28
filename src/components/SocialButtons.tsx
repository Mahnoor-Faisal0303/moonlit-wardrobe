"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FacebookAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import { authErrorMessage } from "@/lib/auth-errors";
import { NOT_CONFIGURED_MESSAGE, getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { Spinner } from "./ui";

type Provider = "Google" | "Facebook" | "Apple";

const base =
  "flex min-h-14 w-full items-center justify-center gap-4 rounded-full py-4 text-base font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

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

const FacebookIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="12" fill="#fff" />
    <path fill="#1877f2" d="M16.7 15.5l.5-3.5h-3.3V9.8c0-1 .5-1.9 2-1.9h1.5V4.9s-1.4-.2-2.7-.2c-2.8 0-4.6 1.7-4.6 4.7V12H7v3.5h3.1V24h3.8v-8.5h2.8Z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="26" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden>
    <path d="M16.4 12.7c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.4-.9-2.4-3.7ZM14 5.6c.7-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3Z" />
  </svg>
);

export default function SocialButtons({
  onError,
  beforeStart,
}: {
  onError: (message: string | null) => void;
  /** Return false to cancel (e.g. the terms box isn't ticked yet). */
  beforeStart?: () => boolean;
}) {
  const router = useRouter();
  const [active, setActive] = useState<Provider | null>(null);

  const start = async (provider: Provider) => {
    if (active) return;
    onError(null);
    if (!isFirebaseConfigured) return onError(NOT_CONFIGURED_MESSAGE);
    if (beforeStart && !beforeStart()) return;
    const p = provider === "Google" ? new GoogleAuthProvider() : provider === "Facebook" ? new FacebookAuthProvider() : new OAuthProvider("apple.com");
    setActive(provider);
    try {
      await signInWithPopup(getFirebaseAuth(), p);
      router.replace("/");
    } catch (err) {
      onError(authErrorMessage(err));
    } finally {
      setActive(null);
    }
  };

  const content = (provider: Provider, icon: React.ReactNode) => (
    <>
      {active === provider ? <Spinner className="h-7 w-7" /> : icon}
      Continue With {provider}
    </>
  );

  return (
    <div className="space-y-5">
      <button type="button" disabled={!!active} onClick={() => start("Google")} className={`${base} border border-line text-fg hover:bg-primary-soft`}>
        {content("Google", <GoogleIcon />)}
      </button>
      <button type="button" disabled={!!active} onClick={() => start("Facebook")} className={`${base} bg-[#1877f2] text-white`}>
        {content("Facebook", <FacebookIcon />)}
      </button>
      <button type="button" disabled={!!active} onClick={() => start("Apple")} className={`${base} bg-[#1c1c1c] text-white`}>
        {content("Apple", <AppleIcon />)}
      </button>
    </div>
  );
}
