/**
 * Shrinks a photo in the browser and returns it as a JPEG data URL, so it can be stored directly in Firestore
 * (documents are limited to 1 MiB). It keeps JPEG quality high and reduces the dimensions in small steps
 * until the result fits `maxChars`, so photos stay sharp instead of turning blocky.
 */
export async function compressImage(file: File, maxSide: number, maxChars: number): Promise<string> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    let scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    for (let attempt = 0; attempt < 12; attempt++) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not available in this browser.");
      ctx.fillStyle = "#fff"; // JPEG has no transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.94, 0.9, 0.85, 0.8]) {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (dataUrl.length <= maxChars) return dataUrl;
      }
      scale *= 0.88;
    }
    throw new Error(`"${file.name}" could not be made small enough. Try a smaller image.`);
  } finally {
    bitmap.close();
  }
}
