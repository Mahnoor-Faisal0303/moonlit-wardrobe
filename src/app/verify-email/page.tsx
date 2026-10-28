import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import VerifyEmail from "@/components/VerifyEmail";

export const metadata: Metadata = { title: "Verify Email — Moonlit Wardrobe" };

export default function VerifyEmailPage() {
  return (
    <AuthShell tagline="One last step to start exploring">
      <VerifyEmail />
    </AuthShell>
  );
}
