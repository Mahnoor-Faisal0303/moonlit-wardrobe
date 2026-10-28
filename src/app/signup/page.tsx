import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import SignUpForm from "@/components/SignUpForm";

export const metadata: Metadata = { title: "Sign Up — Moonlit Wardrobe" };

export default function SignUpPage() {
  return (
    <AuthShell tagline="Begin your meta fashion journey here">
      <SignUpForm />
    </AuthShell>
  );
}
