import type { ReactNode } from "react";

export function Art({ hue, className = "", children }: { hue: [string, string]; className?: string; children?: ReactNode }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `radial-gradient(circle at 30% 25%, ${hue[0]}, ${hue[1]} 80%)` }}
    >
      {children}
    </div>
  );
}

export function Button({
  children, variant = "primary", className = "", ...rest
}: { variant?: "primary" | "ghost" | "outline" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: "bg-primary text-primary-fg hover:bg-primary-hover",
    ghost: "bg-surface-strong text-fg hover:bg-primary-soft",
    outline: "border border-primary text-accent hover:bg-primary-soft",
  }[variant];
  return (
    <button {...rest} className={`rounded-md px-4 py-2 text-xs font-medium transition-colors ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-md text-center">
      <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-xs text-muted">{subtitle}</p>}
    </div>
  );
}

export function Heart({ filled }: { filled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "var(--danger)" : "none"} stroke={filled ? "var(--danger)" : "currentColor"} strokeWidth="2">
      <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9Z" />
    </svg>
  );
}

export function Verified() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--primary)">
      <path d="m12 1 2.6 2.2 3.4-.2.9 3.3 3 1.6-1.1 3.2 1.1 3.2-3 1.6-.9 3.3-3.4-.2L12 23l-2.6-2.2-3.4.2-.9-3.3-3-1.6L3.2 12 2.1 8.8l3-1.6.9-3.3 3.4.2Z" />
      <path d="m8 12 3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" />
    </svg>
  );
}
