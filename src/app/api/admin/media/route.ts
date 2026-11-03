import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import fs from "node:fs/promises";
import path from "node:path";

export interface MediaItem {
  url: string;
  name: string;
  size: number;
  type: "image" | "video";
  createdAt: string;
}

const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".ogg", ".mov"]);

export const GET = withAuth(
  async () => {
    try {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const files = await fs.readdir(uploadsDir);
      const mediaList: MediaItem[] = [];

      for (const file of files) {
        if (file === ".gitkeep") continue;
        const filePath = path.join(uploadsDir, file);
        try {
          const stats = await fs.stat(filePath);
          if (stats.isFile()) {
            const ext = path.extname(file).toLowerCase();
            const isVideo = VIDEO_EXTENSIONS.has(ext);

            mediaList.push({
              url: `/uploads/${file}`,
              name: file,
              size: stats.size,
              type: isVideo ? "video" : "image",
              createdAt: stats.birthtime.toISOString(),
            });
          }
        } catch {
          // Skip unreadable files
        }
      }

      mediaList.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      return NextResponse.json({ ok: true, media: mediaList });
    } catch (err: unknown) {
      console.error("[MEDIA_LIST_ERROR]", err);
      return NextResponse.json(
        { ok: false, message: "خطا در دریافت لیست رسانه‌ها." },
        { status: 500 },
      );
    }
  },
  { roles: ["admin", "editor"] },
);
