import { getFirebaseAuth } from "./firebase";

/** Uploads one photo to Cloudinary with a signature from our server and returns its permanent URL. */
export async function uploadPhoto(file: File): Promise<string> {
  const idToken = await getFirebaseAuth().currentUser?.getIdToken();
  if (!idToken) throw new Error("Please sign in again.");
  const signed = await fetch("/api/upload-signature", { method: "POST", headers: { Authorization: `Bearer ${idToken}` } });
  const params = await signed.json().catch(() => null);
  if (!signed.ok) throw new Error(params?.error ?? "Could not start the photo upload.");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", params.apiKey);
  body.append("timestamp", String(params.timestamp));
  body.append("folder", params.folder);
  body.append("signature", params.signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${params.cloudName}/image/upload`, { method: "POST", body });
  const result = await res.json().catch(() => null);
  if (!res.ok || typeof result?.secure_url !== "string") {
    throw new Error(`"${file.name}" could not be uploaded${result?.error?.message ? `: ${result.error.message}` : "."}`);
  }
  return result.secure_url;
}

/**
 * A resized copy of a Cloudinary photo, in the best format for the visitor's browser (WebP/AVIF) at top quality.
 * Any resize already in the URL is replaced.
 */
export function photoUrl(url: string, width: number): string {
  return url.replace(/\/image\/upload\/(?:[^/]*,[^/]*\/)?/, `/image/upload/f_auto,q_auto:best,c_limit,w_${width}/`);
}
