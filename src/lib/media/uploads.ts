import path from "node:path";

export function getUploadsDir(cwd = process.cwd()): string {
  return path.join(cwd, "public/uploads");
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
