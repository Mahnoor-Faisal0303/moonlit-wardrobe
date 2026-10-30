"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { authErrorField, authErrorMessage } from "@/lib/auth-errors";
import { NOT_CONFIGURED_MESSAGE, getDb, getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { markEmailSent } from "@/lib/verify-cooldown";
import { parseBirthdate, validateEmail, validateName, validatePassword } from "@/lib/validation";
import { useAuth } from "./AuthProvider";
import { AuthCard, FormError } from "./auth-ui";
import { SelectField, TextField } from "./fields";
import PasswordField from "./PasswordField";
import PasswordStrength from "./PasswordStrength";
import SocialButtons from "./SocialButtons";
import { Button } from "./ui";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type Field = "email" | "firstName" | "lastName" | "password" | "confirm" | "dob";
type Errors = Partial<Record<Field, string>>;
// The input to focus for each field when it has an error.
const focusTarget: Record<Field, string> = { email: "email", firstName: "firstName", lastName: "lastName", password: "password", confirm: "confirm", dob: "month" };

const daysIn = (month: number, year: number) => (month ? new Date(year || 2000, month, 0).getDate() : 31);

export default function SignUpForm() {
  const router = useRouter();
  const { user } = useAuth();
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dob, setDob] = useState({ month: "", day: "", year: "" });
  const [years, setYears] = useState<number[]>([]);

  // Computed after mount: reading the current date during prerender isn't allowed.
  useEffect(() => {
    const thisYear = new Date().getFullYear();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYears(Array.from({ length: 101 }, (_, i) => thisYear - i));
  }, []);

  // Already signed in: never show the sign-up form.
  useEffect(() => {
    if (user) router.replace(user.emailVerified ? "/" : "/verify-email");
  }, [user, router]);

  const clear = (field: Field) => setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));

  const fail = (found: Errors) => {
    setErrors(found);
    const first = (Object.keys(focusTarget) as Field[]).find((k) => found[k]);
    if (first) (formRef.current?.elements.namedItem(focusTarget[first]) as HTMLElement | null)?.focus();
  };

  const setDobPart = (part: "month" | "day" | "year", value: string) => {
    const next = { ...dob, [part]: value };
    // Keep the day valid for the chosen month/year (e.g. Mar 31 -> Feb).
    if (next.day && Number(next.day) > daysIn(Number(next.month), Number(next.year))) next.day = "";
    setDob(next);
    clear("dob");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting.current) return;
    setFormError(null);
    if (!isFirebaseConfigured) return setFormError(NOT_CONFIGURED_MESSAGE);

    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const firstName = String(f.get("firstName")).trim();
    const lastName = String(f.get("lastName")).trim();
    const birthdate = parseBirthdate(dob.month, dob.day, dob.year);

    const found: Errors = {};
    const emailProblem = validateEmail(email);
    if (emailProblem) found.email = emailProblem;
    const firstProblem = validateName(firstName, "First name");
    if (firstProblem) found.firstName = firstProblem;
    const lastProblem = validateName(lastName, "Last name");
    if (lastProblem) found.lastName = lastProblem;
    const passwordProblem = validatePassword(password);
    if (passwordProblem) found.password = passwordProblem;
    if (!confirm) found.confirm = "Please confirm your password.";
    else if (confirm !== password) found.confirm = "Passwords do not match.";
    if ("error" in birthdate) found.dob = dob.month && dob.day && dob.year ? birthdate.error : "Please select your date of birth.";
    if (Object.keys(found).length) return fail(found);

    submitting.current = true;
    setBusy(true);
    setErrors({});
    try {
      const { user: created } = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      await updateProfile(created, { displayName: `${firstName} ${lastName}` });
      await sendEmailVerification(created).then(markEmailSent).catch(() => {});
      // Fire-and-forget: Firestore retries forever when offline/misconfigured, which would otherwise hang sign-up.
      setDoc(doc(getDb(), "users", created.uid), {
        email,
        firstName,
        lastName,
        birthdate: "value" in birthdate ? birthdate.value : "",
        createdAt: serverTimestamp(),
      }).catch((err) => console.warn("Could not save profile to Firestore:", err));
      router.replace("/verify-email");
    } catch (err) {
      const message = authErrorMessage(err);
      const field = authErrorField(err);
      if (message && field) fail({ [field]: message } as Errors);
      else setFormError(message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  const dobInvalid = !!errors.dob;

  return (
    <AuthCard formRef={formRef} onSubmit={submit}>
      <h1 className="text-3xl font-bold">Sign Up</h1>
      <p className="mt-4 text-sm">
        Already a Member? <Link href="/signin" className="text-accent hover:underline">Sign In</Link>
      </p>

      <div className="mt-6">
        <TextField name="email" type="email" label="Email Address" autoComplete="email" error={errors.email} onChange={() => clear("email")} />
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <TextField name="firstName" label="First Name" autoComplete="given-name" maxLength={50} error={errors.firstName} onChange={() => clear("firstName")} />
          <TextField name="lastName" label="Last Name" autoComplete="family-name" maxLength={50} error={errors.lastName} onChange={() => clear("lastName")} />
        </div>
        <PasswordField
          name="password"
          label="Password"
          autoComplete="new-password"
          value={password}
          error={errors.password}
          onChange={(e) => { setPassword(e.target.value); clear("password"); }}
        />
        <PasswordStrength value={password} />
        <PasswordField
          className="mt-4"
          name="confirm"
          label="Confirm Password"
          autoComplete="new-password"
          value={confirm}
          error={errors.confirm ?? (confirm && confirm !== password ? "Passwords do not match." : null)}
          onChange={(e) => { setConfirm(e.target.value); clear("confirm"); }}
        />

        <fieldset className="mt-2">
          <legend className="mb-2 text-base font-medium text-fg">Date Of Birth</legend>
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4">
            <SelectField name="month" label="Month" invalid={dobInvalid} value={dob.month} onChange={(e) => setDobPart("month", e.target.value)}>
              <option value="" disabled className="text-black">Month</option>
              {months.map((m, i) => <option key={m} value={i + 1} className="text-black">{m}</option>)}
            </SelectField>
            <SelectField name="day" label="Day" invalid={dobInvalid} value={dob.day} onChange={(e) => setDobPart("day", e.target.value)}>
              <option value="" disabled className="text-black">Day</option>
              {Array.from({ length: daysIn(Number(dob.month), Number(dob.year)) }, (_, i) => (
                <option key={i + 1} value={i + 1} className="text-black">{i + 1}</option>
              ))}
            </SelectField>
            <SelectField name="year" label="Year" invalid={dobInvalid} value={dob.year} onChange={(e) => setDobPart("year", e.target.value)}>
              <option value="" disabled className="text-black">Year</option>
              {years.map((y) => <option key={y} value={y} className="text-black">{y}</option>)}
            </SelectField>
          </div>
          <p role={errors.dob ? "alert" : undefined} className="min-h-5 pt-1 text-xs text-danger">{errors.dob}</p>
        </fieldset>
      </div>

      <FormError message={formError} />
      <Button type="submit" loading={busy} className="min-h-12 w-full rounded-full !bg-gradient-to-r !from-primary !to-[#9333ea] !text-base">
        {busy ? "Creating account…" : "Create Account"}
      </Button>

      <p className="my-8 text-center text-sm">Or</p>
      <SocialButtons onError={setFormError} />
    </AuthCard>
  );
}
