import { NextResponse } from "next/server";
import { contactApiSchema } from "@/lib/contact-schema";
import { takeRateLimit } from "@/lib/rate-limit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const limited = takeRateLimit(
    `contact:${clientKey(request)}`,
    MAX_REQUESTS,
    WINDOW_MS,
  );

  if (!limited.ok) {
    const retryAfterSec = Math.ceil(limited.retryAfterMs / 1000);
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        message: "rate_limited",
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", message: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = contactApiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "validation_error",
        message: "validation_error",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  // Honeypot filled → pretend success, do not forward.
  if (payload.website && payload.website.trim().length > 0) {
    return NextResponse.json({ ok: true, code: "accepted" });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json(
      {
        ok: false,
        code: "misconfigured",
        message: "webhook_missing",
      },
      { status: 503 },
    );
  }

  const contact =
    [payload.email.trim(), payload.phone.trim()].filter(Boolean).join(" · ") ||
    "";

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone.trim() || null,
        email: payload.email.trim() || null,
        contact,
        service: payload.service,
        stage: payload.stage,
        message: payload.message,
        consent: payload.consent,
        submittedAt: new Date().toISOString(),
        source: "kara-web/contact",
      }),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        {
          ok: false,
          code: "upstream_error",
          message: "upstream_error",
        },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "upstream_unreachable",
        message: "upstream_unreachable",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, code: "accepted" });
}
