/** Minimum age to create an account. Change to 13 if your market allows it. */
export const MIN_AGE = 18;

export function validateEmail(value: string): string | null {
  if (!value) return "Please enter your email address.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Please enter a valid email address.";
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
  { id: "lower", label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "upper", label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "digit", label: "A number", test: (p: string) => /\d/.test(p) },
  { id: "symbol", label: "A symbol (e.g. ! @ # $)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const COMMON_PASSWORDS = ["password", "passw0rd", "12345678", "123456789", "qwerty", "qwerty123", "letmein", "welcome", "iloveyou", "admin123", "abc12345"];

export const isCommonPassword = (p: string) => COMMON_PASSWORDS.some((c) => p.toLowerCase().includes(c));

export function validatePassword(p: string): string | null {
  if (!passwordRules.every((r) => r.test(p))) return "Password doesn't meet all the requirements below.";
  if (isCommonPassword(p)) return "That password is too common. Please choose a less predictable one.";
  return null;
}

/** 0 (empty) – 4 (strong). */
export function passwordStrength(p: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!p) return { score: 0, label: "" };
  const passed = passwordRules.filter((r) => r.test(p)).length;
  const bonus = p.length >= 12 ? 1 : 0;
  const raw = isCommonPassword(p) ? 1 : Math.min(4, Math.max(1, passed - 1 + bonus));
  const score = raw as 1 | 2 | 3 | 4;
  return { score, label: ["", "Weak", "Fair", "Good", "Strong"][score] };
}
