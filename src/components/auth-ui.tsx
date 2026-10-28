import type { FormEventHandler, ReactNode, Ref } from "react";

export function AuthCard({ onSubmit, formRef, children }: { onSubmit: FormEventHandler<HTMLFormElement>; formRef?: Ref<HTMLFormElement>; children: ReactNode }) {
  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="w-full max-w-[520px] rounded-xl bg-surface-strong p-8 shadow-card backdrop-blur-sm sm:p-10">
      {children}
    </form>
  );
}

/** Form-level error. The space is always reserved so the button below never jumps. */
export function FormError({ message }: { message: string | null }) {
  return (
    <div className="mt-4 min-h-12" aria-live="assertive">
      {message && <p role="alert" className="rounded-md bg-danger/15 px-3 py-2 text-sm text-danger">{message}</p>}
    </div>
  );
}

export function FormNotice({ message }: { message: string | null }) {
  return (
    <div className="mt-4 min-h-12" aria-live="polite">
      {message && <p role="status" className="rounded-md bg-primary-soft px-3 py-2 text-sm">{message}</p>}
    </div>
  );
}
