"use client";

import { photoUrl } from "./cloudinary";

// Every next/image goes through this loader. Cloudinary photos are resized by Cloudinary itself, at high quality,
// instead of being compressed a second time by Next.js, which is what made them look soft. Everything else
// (the built-in sample photos) still uses Next's own optimizer.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.includes("res.cloudinary.com")) return photoUrl(src, width);
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
