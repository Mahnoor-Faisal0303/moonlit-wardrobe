import { createHash } from "node:crypto";
import { verifyAdmin } from "@/lib/admin-auth";

// Gives a signed-in admin a short-lived signature to upload one photo straight to Cloudinary.
// The API secret never leaves the server, and nobody else can upload to the shop's account.

const FOLDER = "moonlit-wardrobe";

export async function POST(request: Request) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return Response.json(
      { error: "Photo storage is not set up. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the environment variables." },
      { status: 503 },
    );
  }

  const admin = await verifyAdmin(request);
  if (!admin.ok) return Response.json({ error: admin.error }, { status: admin.status });

  const timestamp = Math.floor(Date.now() / 1000);
  // Cloudinary signs the upload parameters in alphabetical order, followed by the API secret.
  const signature = createHash("sha1").update(`folder=${FOLDER}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`).digest("hex");

  return Response.json({ cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, folder: FOLDER, timestamp, signature });
}
