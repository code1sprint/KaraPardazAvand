/**
 * Client-side image compression and resizing utility.
 * Optimizes photos/screenshots before uploading to server, avoiding:
 * - 502 Bad Gateway / 413 Payload Too Large caused by Nginx or reverse proxy
 * - Slow upload times on restricted networks
 * - Excessive memory consumption in Node.js server
 */

export interface CompressionOptions {
  maxDimension?: number;
  quality?: number;
  maxSizeBytes?: number;
}

export async function compressImageIfNeeded(
  file: File,
  options: CompressionOptions = {},
): Promise<File> {
  const {
    maxDimension = 2048,
    quality = 0.85,
    maxSizeBytes = 1.5 * 1024 * 1024, // 1.5MB threshold
  } = options;

  // Only compress raster formats that benefit from canvas compression
  const compressableTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!compressableTypes.includes(file.type.toLowerCase())) {
    return file;
  }

  // If already lightweight, do not touch
  if (file.size <= maxSizeBytes) {
    return file;
  }

  // Running in browser?
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Downscale if dimensions exceed maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      // Draw and export
      ctx.drawImage(img, 0, 0, width, height);

      // Prefer WebP for high compression efficiency, or keep JPEG
      const outputType = file.type === "image/png" ? "image/webp" : file.type;

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // If compression didn't save space, return original
            resolve(file);
            return;
          }

          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const extension = outputType === "image/webp" ? ".webp" : ".jpg";
          const compressedFile = new File([blob], `${baseName}${extension}`, {
            type: outputType,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        outputType,
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
