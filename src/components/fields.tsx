"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> & {
  label: string;
  error?: string | null;
  /** Element rendered at the right edge of the input (e.g. the password eye). */
  trailing?: ReactNode;
};

/** Floating-label text input with a reserved line for its inline error. */
export function TextField({ label, error, trailing, className = "", ...rest }: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <div className="relative">
        <input
          {...rest}
          id={id}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`peer w-full border-b bg-transparent pb-2 pt-6 text-base text-fg outline-none transition-colors focus:border-primary ${
            error ? "border-danger" : "border-line"
          } ${trailing ? "pr-11" : ""}`}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-0 top-[1.1rem] origin-left text-base text-muted transition-all peer-focus:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-autofill:top-1 peer-autofill:text-xs"
        >
          {label}
        </label>
        {trailing}
      </div>
      <p id={errorId} role={error ? "alert" : undefined} className="min-h-5 pt-1 text-xs text-danger">
        {error}
      </p>
    </div>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  invalid?: boolean;
  children: ReactNode;
};

/** Select with a visible label above it and a custom chevron. 44px tall for touch. */
export function SelectField({ label, invalid, className = "", children, ...rest }: SelectFieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs text-muted">{label}</label>
      <div className="relative">
        <select
          {...rest}
          id={id}
          aria-invalid={invalid}
          className={`h-11 w-full appearance-none border-b bg-transparent pr-6 text-sm text-fg outline-none transition-colors focus:border-primary ${
            invalid ? "border-danger" : "border-line"
          }`}
        >
          {children}
        </select>
        <svg className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
