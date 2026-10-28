"use client";

import { useState } from "react";
import { fieldClass } from "./auth-ui";

export default function PasswordField({ className = "", ...rest }: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [show, setShow] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <input {...rest} type={show ? "text" : "password"} className={`${fieldClass} pr-8`} />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-0 top-0 text-fg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {!show && <path d="M3 3l18 18" />}
        </svg>
      </button>
    </div>
  );
}
