/** Minimum age to create an account. Change to 13 if your market allows it. */
export const MIN_AGE = 18;

export function validateEmail(value: string): string | null {
  if (!value) return "Please enter your email address.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Please enter a valid email address.";
}

export function validatePhone(value: string): string | null {
  if (!value) return "Please enter your phone number.";
  const digits = value.replace(/\D/g, "").length;
  if (!/^\+?[\d\s()-]+$/.test(value) || digits < 10 || digits > 15) return "Please enter a valid phone number, e.g. 0300 1234567.";
  return null;
}

export function validateRequired(value: string, label: string, min: number, max: number): string | null {
  if (!value) return `Please enter ${label}.`;
  if (value.length < min) return `${label[0].toUpperCase()}${label.slice(1)} must be at least ${min} characters.`;
  if (value.length > max) return `${label[0].toUpperCase()}${label.slice(1)} must be ${max} characters or fewer.`;
  return null;
}

// Letters (any language), plus spaces, apostrophes and hyphens inside a name. No digits, no HTML characters.
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}\s'’-]*$/u;

export function validateName(value: string, label: string): string | null {
  if (value.length < 2) return `${label} must be at least 2 characters.`;
  if (value.length > 50) return `${label} must be 50 characters or fewer.`;
  if (!NAME_PATTERN.test(value)) return `${label} can only contain letters, spaces, apostrophes and hyphens.`;
  return null;
}

export type Birthdate = { value: string } | { error: string };

export function parseBirthdate(month: string, day: string, year: string, today = new Date()): Birthdate {
  const m = Number(month), d = Number(day), y = Number(year);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d || date > today) {
    return { error: "Please enter a valid date of birth." };
  }
  const cutoff = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
  if (date > cutoff) return { error: `You must be at least ${MIN_AGE} years old to create an account.` };
  const pad = (n: number) => String(n).padStart(2, "0");
  return { value: `${y}-${pad(m)}-${pad(d)}` };
}

export const passwordRules = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
];

export function validatePassword(p: string): string | null {
  return passwordRules.every((r) => r.test(p)) ? null : "Password must be at least 8 characters.";
}

/** 0 (empty) – 4 (strong). Only a hint; length is the one requirement. */
export function passwordStrength(p: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!p) return { score: 0, label: "" };
  const score = (p.length < 8 ? 1 : p.length < 10 ? 2 : p.length < 12 ? 3 : 4) as 1 | 2 | 3 | 4;
  return { score, label: ["", "Weak", "Fair", "Good", "Strong"][score] };
}
