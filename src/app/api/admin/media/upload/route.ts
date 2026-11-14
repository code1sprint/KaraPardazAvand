import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { getUploadsDir, mapUploadFsError } from "@/lib/media/uploads";
import fs from "node:fs/promises";
import path from "node:path";

export const maxDuration = 60;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const POST = withAuth(
  async (request: Request) => {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { ok: false, message: "فایلی برای آپلود ارسال نشده است." },
          { status: 400 },
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { ok: false, message: "حجم فایل نمی‌تواند بیش از ۵۰ مگابایت باشد." },
          { status: 413 },
        );
      }

      const mimeType = file.type.toLowerCase();
      const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

      if (!isImage && !isVideo) {
        return NextResponse.json(
          {
            ok: false,
            message: "فرمت فایل مجاز نیست. لطفاً یک تصویر (PNG, JPG, WebP, SVG) یا ویدیو (MP4, WebM) انتخاب کنید.",
          },
          { status: 415 },
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize extension and filename
      const rawExt = path.extname(file.name).toLowerCase() || (isImage ? ".webp" : ".mp4");
      const baseName = path
        .basename(file.name, rawExt)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .slice(0, 40);

      const uniqueName = `${Date.now()}-${baseName || "media"}${rawExt}`;
      const uploadsDir = getUploadsDir();

      await fs.mkdir(uploadsDir, { recursive: true });
      const targetPath = path.join(uploadsDir, uniqueName);
      await fs.writeFile(targetPath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;

      return NextResponse.json({
        ok: true,
        message: "فایل با موفقیت آپلود شد.",
        url: publicUrl,
        filename: uniqueName,
        type: isImage ? "image" : "video",
        size: file.size,
      });
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: unknown }).code)
          : undefined;
      console.error("[UPLOAD_ERROR]", { code, err });
      const mapped = mapUploadFsError(err);
      return NextResponse.json(
        { ok: false, message: mapped.message },
        { status: mapped.status },
      );
    }
  },
  { roles: ["admin", "editor"] },
);
