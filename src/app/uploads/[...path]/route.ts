import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import {
  contentTypeForUpload,
  getUploadsDir,
  resolveUploadFilePath,
} from "@/lib/media/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function serveUpload(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { path: segments } = await context.params;
  const filePath = resolveUploadFilePath(segments, getUploadsDir());

  if (!filePath) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const headers = new Headers({
      "Content-Type": contentTypeForUpload(filePath),
      "Content-Length": String(fileStat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Last-Modified": fileStat.mtime.toUTCString(),
    });

    if (request.method === "HEAD") {
      return new NextResponse(null, { status: 200, headers });
    }

    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new NextResponse(webStream, { status: 200, headers });
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code?: unknown }).code)
        : undefined;
    if (code === "ENOENT") {
      return new NextResponse("Not Found", { status: 404 });
    }
    console.error("[UPLOADS_SERVE_ERROR]", { code, err });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request, context: RouteContext) {
  return serveUpload(request, context);
}

export async function HEAD(request: Request, context: RouteContext) {
  return serveUpload(request, context);
}
