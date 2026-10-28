"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { authErrorMessage } from "@/lib/auth-errors";
import { NOT_CONFIGURED_MESSAGE, getDb, getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { AuthCard, FormError, fieldClass } from "./auth-ui";
import PasswordField from "./PasswordField";
import { Button } from "./ui";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dobField = "w-full border-b border-line bg-transparent pb-2 text-sm text-fg outline-none placeholder:text-subtle focus:border-primary";

const pad = (n: string | number) => String(n).padStart(2, "0");

function toBirthdate(month: string, day: string, year: string): string | null {
  const m = Number(month), d = Number(day), y = Number(year);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d || date > new Date()) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

export default function SignUpForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!isFirebaseConfigured) return setError(NOT_CONFIGURED_MESSAGE);

    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const password = String(f.get("password"));
    const birthdate = toBirthdate(String(f.get("month")), String(f.get("day")), String(f.get("year")));
    if (!birthdate) return setError("Please enter a valid date of birth.");

    setBusy(true);
    try {
      const firstName = String(f.get("firstName")).trim();
      const lastName = String(f.get("lastName")).trim();
      const { user: created } = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      await updateProfile(created, { displayName: `${firstName} ${lastName}` });
      sendEmailVerification(created).catch(() => {});
      // Profile data lives in Firestore; a failure here (e.g. Firestore not enabled yet) must not block sign-up.
      await setDoc(doc(getDb(), "users", created.uid), { email, firstName, lastName, birthdate, createdAt: serverTimestamp() }).catch((err) =>
        console.warn("Could not save profile to Firestore:", err),
      );
      router.replace("/");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard onSubmit={submit}>
      <h1 className="text-3xl font-bold">Sign Up</h1>
      <p className="mt-6 text-sm">
        Already a Member? <Link href="/signin" className="text-accent hover:underline">Sign In</Link>
      </p>

      <div className="mt-12 space-y-12">
        <input name="email" type="email" required placeholder="Email Address" autoComplete="email" className={fieldClass} />
        <div className="grid grid-cols-2 gap-8">
          <input name="firstName" type="text" required placeholder="Full Name" autoComplete="given-name" className={fieldClass} />
          <input name="lastName" type="text" required placeholder="Last Name" autoComplete="family-name" className={fieldClass} />
        </div>
        <PasswordField name="password" required minLength={8} placeholder="Password" autoComplete="new-password" />
        <div>
          <p className="mb-8 text-base">Date Of Birth</p>
          <div className="grid grid-cols-3 gap-6">
            <select name="month" required defaultValue="" className={`${dobField} appearance-none`}>
              <option value="" disabled>Month</option>
              {months.map((m, i) => <option key={m} value={i + 1} className="text-black">{m}</option>)}
            </select>
            <input name="day" type="number" required min={1} max={31} placeholder="Day" className={dobField} />
            <input name="year" type="number" required min={1900} max={2100} placeholder="Year" className={dobField} />
          </div>
        </div>
      </div>

      <FormError message={error} />
      <div className="mt-12 flex justify-end">
        <Button type="submit" disabled={busy} className="rounded-full !bg-gradient-to-r !from-primary !to-[#9333ea] !px-7 !py-3 !text-base disabled:opacity-60">
          {busy ? "Creating…" : "Create Account"}
        </Button>
      </div>
    </AuthCard>
  );
}
