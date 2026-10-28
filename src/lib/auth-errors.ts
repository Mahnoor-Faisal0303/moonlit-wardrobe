const messages: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/operation-not-allowed": "This sign-in method is not enabled in the Firebase console.",
  "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
};

// Errors that belong to a specific input rather than the whole form.
const fields: Record<string, "email" | "password"> = {
  "auth/invalid-email": "email",
  "auth/user-not-found": "email",
  "auth/email-already-in-use": "email",
  "auth/invalid-credential": "password",
  "auth/wrong-password": "password",
  "auth/weak-password": "password",
};

const ignored = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request"]);

const codeOf = (err: unknown) =>
  typeof err === "object" && err && "code" in err ? String((err as { code: unknown }).code) : "";

/** Returns a user-facing message, or null when the error should be silently ignored. */
export function authErrorMessage(err: unknown): string | null {
  const code = codeOf(err);
  if (ignored.has(code)) return null;
  return messages[code] ?? "Something went wrong. Please try again.";
}

/** The input an error should be attached to, or null for a form-level error. */
export function authErrorField(err: unknown): "email" | "password" | null {
  return fields[codeOf(err)] ?? null;
}
