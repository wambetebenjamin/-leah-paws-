import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as {
    token?: unknown;
    action?: unknown;
    v2Token?: unknown;
  } | null;

  if (!body || typeof body.token !== "string" || !body.token) {
    return NextResponse.json({ ok: false, error: "A reCAPTCHA token is required" }, { status: 400 });
  }

  const result = await verifyRecaptcha(
    body.token,
    typeof body.action === "string" ? body.action : undefined,
    typeof body.v2Token === "string" ? body.v2Token : undefined
  );

  return NextResponse.json(result, { status: result.ok ? 200 : result.requiresV2 ? 422 : 400 });
}
