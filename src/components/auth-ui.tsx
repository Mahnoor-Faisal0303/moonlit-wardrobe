import type { FormEventHandler, ReactNode } from "react";

export const fieldClass =
  "w-full border-b border-line bg-transparent pb-3 text-base text-fg outline-none transition-colors placeholder:text-fg focus:border-primary";

export function AuthCard({ onSubmit, children }: { onSubmit: FormEventHandler<HTMLFormElement>; children: ReactNode }) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-[520px] rounded-xl bg-surface-strong p-8 shadow-card backdrop-blur-sm sm:p-10">
      {children}
    </form>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p role="alert" className="mt-6 rounded-md bg-danger/15 px-3 py-2 text-sm text-danger">{message}</p>;
}

export function FormNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return <p role="status" className="mt-6 rounded-md bg-primary-soft px-3 py-2 text-sm">{message}</p>;
}
