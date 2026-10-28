"use client";

import Link from "next/link";
import { Button } from "./ui";

const social = "flex w-full items-center justify-center gap-4 rounded-full py-5 text-base font-medium transition-opacity hover:opacity-90";

function GoogleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6Z" />
      <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1Z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.500 42.600 14.600 48 24 48Z" />
    </svg>
  );
}

export default function SignInForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-[520px] rounded-xl bg-surface-strong p-8 shadow-card backdrop-blur-sm sm:p-10"
    >
      <h1 className="text-3xl font-bold">Sign In</h1>
      <p className="mt-10 text-sm">
        New user? <Link href="/signup" className="text-accent hover:underline">Create an account</Link>
      </p>

      <input
        type="email"
        required
        autoComplete="email"
        placeholder="Email Address"
        className="mt-14 w-full border-b border-line bg-transparent pb-3 text-base text-fg outline-none transition-colors placeholder:text-fg focus:border-primary"
      />
      <div className="mt-3 flex justify-end">
        <Button type="submit" className="rounded-full !bg-gradient-to-r !from-primary !to-[#9333ea] !px-6 !py-2 !text-sm">Continue</Button>
      </div>

      <p className="my-12 text-center text-sm">Or</p>

      <div className="space-y-6">
        <button type="button" className={`${social} border border-line text-fg hover:bg-primary-soft`}>
          <GoogleIcon /> Continue With Google
        </button>
        <button type="button" className={`${social} bg-[#1877f2] text-white`}>
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="12" fill="#fff" /><path fill="#1877f2" d="M16.7 15.5l.5-3.5h-3.3V9.8c0-1 .5-1.9 2-1.9h1.5V4.900s-1.400-.2-2.700-.2c-2.800 0-4.600 1.700-4.600 4.700V12H7v3.500h3.100V24h3.800v-8.500h2.800Z" /></svg>
          Continue With Facebook
        </button>
        <button type="button" className={`${social} bg-[#1c1c1c] text-white`}>
          <svg width="26" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M16.4 12.700c0-2.400 2-3.500 2.100-3.600-1.100-1.700-2.900-1.900-3.500-1.900-1.500-.2-2.900.9-3.700.9-.8 0-1.900-.9-3.200-.8-1.600 0-3.100 1-4 2.400-1.700 3-.4 7.400 1.200 9.800.8 1.200 1.800 2.500 3 2.400 1.200 0 1.700-.8 3.100-.8 1.500 0 1.900.8 3.200.8 1.300 0 2.100-1.200 2.900-2.300.9-1.300 1.300-2.600 1.300-2.700 0 0-2.400-.9-2.400-3.700ZM14 5.600c.7-.8 1.100-1.900 1-3-.9 0-2.100.6-2.800 1.400-.6.700-1.100 1.800-1 2.900 1.100.1 2.100-.5 2.800-1.300Z" /></svg>
          Continue With Apple
        </button>
      </div>
    </form>
  );
}
