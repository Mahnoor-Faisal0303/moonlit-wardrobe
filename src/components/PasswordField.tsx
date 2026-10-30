"use client";

import { useState, type ComponentProps } from "react";
import { TextField } from "./fields";

type Props = Omit<ComponentProps<typeof TextField>, "type" | "trailing">;

export default function PasswordField(props: Props) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      {...props}
      type={show ? "text" : "password"}
      trailing={
        // The icon shows the action: open eye = "show password", crossed eye = "hide password".
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute right-0 top-1 flex h-11 w-11 items-center justify-center text-muted hover:text-fg"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {show && <path d="M3 3l18 18" />}
          </svg>
        </button>
      }
    />
  );
}
