import { NextResponse } from "next/server";
import { entityConfig } from "@/lib/seo/entity";

const DEFAULT_KEY = "e8f52a7d65c34e8f9b2d8614a9235e19";

export async function POST(req: Request) {
  // Check authorization token if INDEXNOW_SECRET is configured
  const secret = process.env.INDEXNOW_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization") || req.headers.get("x-indexnow-secret");
    if (!authHeader || !authHeader.includes(secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Check if IndexNow is disabled
  if (process.env.DISABLE_INDEXNOW === "true") {
    return NextResponse.json({ message: "IndexNow submission disabled" }, { status: 200 });
  }

  try {
    const body = await req.json();
    const urls: string[] = Array.isArray(body.urls)
      ? body.urls
      : Array.isArray(body.urlList)
        ? body.urlList
        : [];

    if (urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided in urls array" }, { status: 400 });
    }

    const key = process.env.INDEXNOW_KEY || DEFAULT_KEY;
    const host = new URL(entityConfig.url).host;
    const keyLocation = `${entityConfig.url}/${key}.txt`;

    const payload = {
      host,
      key,
      keyLocation,
      urlList: urls,
    };

    const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!indexNowRes.ok && indexNowRes.status !== 202) {
      const errText = await indexNowRes.text();
      return NextResponse.json(
        { error: "IndexNow upstream error", details: errText },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      submitted: urls.length,
      host,
      keyLocation,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process IndexNow request", details: String(err) },
      { status: 500 },
    );
  }
}
