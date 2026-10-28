import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Service — Moonlit Wardrobe" };

export default function TermsPage() {
  return (
    <main className="container-x max-w-3xl py-16">
      <Link href="/signup" className="text-sm text-accent hover:underline">← Back</Link>
      <h1 className="mt-6 text-3xl font-bold">Terms of Service</h1>
      <p className="mt-6 rounded-md bg-primary-soft px-4 py-3 text-sm">
        Placeholder: replace this page with your real Terms of Service, reviewed by a lawyer, before launch.
      </p>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. By creating an account you agree to use Moonlit Wardrobe lawfully and to be at least 18 years old.
      </p>
    </main>
  );
}
