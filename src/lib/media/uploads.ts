import path from "node:path";

export function getUploadsDir(cwd = process.cwd()): string {
  // Statically scoped under public/uploads so Turbopack does not trace the whole tree.
  return path.join(cwd, "public", "uploads");
}

/**
 * Resolve a request path under the uploads root.
 * Returns null on empty paths or traversal attempts.
 */
export function resolveUploadFilePath(
  segments: string[],
  uploadsRoot = getUploadsDir(),
): string | null {
  if (!segments.length || segments.some((s) => !s || s === "." || s === "..")) {
    return null;
  }

  const candidate = path.join(uploadsRoot, ...segments);
  const relative = path.relative(uploadsRoot, candidate);

  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return candidate;
}

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
};

export function contentTypeForUpload(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

export function mapUploadFsError(err: unknown): {
  status: number;
  message: string;
} {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code?: unknown }).code)
      : undefined;

  if (code === "EACCES" || code === "EPERM") {
    return {
      status: 500,
      message:
        "دسترسی نوشتن روی پوشه آپلود وجود ندارد. مالکیت volume را بررسی کنید.",
    };
  }

  return {
    status: 500,
    message: "خطا در پردازش و ذخیره‌سازی فایل.",
  };
}
