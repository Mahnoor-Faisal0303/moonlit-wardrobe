// Server-side check that a request comes from a signed-in admin.
//
// No service-account key is needed: the caller's own Firebase ID token is used to look them up and to read
// their admins/{uid} document, so the Firestore rules decide whether they are an admin.

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export type AdminCheck = { ok: true; token: string; uid: string } | { ok: false; status: number; error: string };

export async function verifyAdmin(request: Request): Promise<AdminCheck> {
  if (!API_KEY || !PROJECT_ID) return { ok: false, status: 503, error: "Firebase is not configured on the server." };

  const token = request.headers.get("authorization")?.replace(/^Bearer /i, "");
  if (!token) return { ok: false, status: 400, error: "Invalid request." };

  // Who is calling?
  const lookup = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });
  const uid = lookup.ok ? ((await lookup.json()) as { users?: { localId: string }[] }).users?.[0]?.localId : undefined;
  if (!uid) return { ok: false, status: 401, error: "Please sign in again." };

  // Are they an admin? (A user can read only their own admins/{uid} document, so this proves it.)
  const adminDoc = await fetch(`${FIRESTORE}/admins/${uid}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!adminDoc.ok) return { ok: false, status: 403, error: "Only admins can do this." };

  return { ok: true, token, uid };
}
