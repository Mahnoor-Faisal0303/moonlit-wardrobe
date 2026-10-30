export const RESEND_COOLDOWN_SECONDS = 60;

const KEY = "verifyEmailSentAt";

/** Remember when a verification email was sent so the cooldown survives navigation and refreshes. */
export function markEmailSent() {
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {}
}

/** Seconds left before another verification email may be requested. */
export function cooldownRemaining(): number {
  try {
    const sentAt = Number(sessionStorage.getItem(KEY));
    if (!sentAt) return 0;
    return Math.max(0, Math.ceil((sentAt + RESEND_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000));
  } catch {
    return 0;
  }
}
