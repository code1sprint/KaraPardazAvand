import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db/mongodb";

export async function GET() {
  const startTime = Date.now();
  const health = await checkDatabaseHealth();
  const latencyMs = Date.now() - startTime;

  if (!health.connected) {
    return NextResponse.json(
      {
        ok: false,
        status: "disconnected",
        message: "پایگاه داده در دسترس نیست یا متصل نشده است.",
        readyState: health.readyState,
        error: health.error,
        latencyMs,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    status: "connected",
    message: "اتصال به پایگاه داده برقرار است.",
    readyState: health.readyState,
    latencyMs,
  });
}
