"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const field =
  "w-full border-b border-line bg-transparent pb-3 text-base text-fg outline-none transition-colors placeholder:text-fg focus:border-primary";
const dobField = "w-full border-b border-line bg-transparent pb-2 text-sm text-fg outline-none placeholder:text-subtle focus:border-primary";

export default function SignUpForm() {
  const [show, setShow] = useState(false);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-[520px] rounded-xl bg-surface-strong p-8 shadow-card backdrop-blur-sm sm:p-10"
    >
      <h1 className="text-3xl font-bold">Sign Up</h1>
      <p className="mt-6 text-sm">
        Already a Member? <Link href="/signin" className="text-accent hover:underline">Sign In</Link>
      </p>

      <div className="mt-12 space-y-12">
        <input type="email" required placeholder="Email Address" autoComplete="email" className={field} />
        <div className="grid grid-cols-2 gap-8">
          <input type="text" required placeholder="Full Name" autoComplete="given-name" className={field} />
          <input type="text" required placeholder="Last Name" autoComplete="family-name" className={field} />
        </div>
        <div className="relative">
          <input type={show ? "text" : "password"} required minLength={8} placeholder="Password" autoComplete="new-password" className={`${field} pr-8`} />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-0 top-0 text-fg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
              {!show && <path d="M3 3l18 18" />}
            </svg>
          </button>
        </div>
        <div>
          <p className="mb-8 text-base">Date Of Birth</p>
          <div className="grid grid-cols-3 gap-6">
            <select required defaultValue="" className={`${dobField} appearance-none`}>
              <option value="" disabled>Month</option>
              {months.map((m) => <option key={m} value={m} className="text-black">{m}</option>)}
            </select>
            <input type="number" required min={1} max={31} placeholder="Day" className={dobField} />
            <input type="number" required min={1900} max={2100} placeholder="Year" className={dobField} />
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <Button type="submit" className="rounded-full !bg-gradient-to-r !from-primary !to-[#9333ea] !px-7 !py-3 !text-base">Create Account</Button>
      </div>
    </form>
  );
}
