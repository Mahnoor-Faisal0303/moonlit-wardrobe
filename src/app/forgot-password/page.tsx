import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset Password — Moonlit Wardrobe" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell tagline="Explore the world of meta fashion">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
