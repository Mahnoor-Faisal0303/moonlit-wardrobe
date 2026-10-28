import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = { title: "Sign In — Moonlit Wardrobe" };

export default function SignInPage() {
  return (
    <AuthShell tagline="Explore the world of meta fashion">
      <SignInForm />
    </AuthShell>
  );
}
