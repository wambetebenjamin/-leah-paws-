import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please complete the contact form" }, { status: 400 });

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, "contact", parsed.data.recaptchaV2Token);
  if (!captcha.ok) {
    return NextResponse.json(
      { error: captcha.reason ?? "Could not verify that request", requiresV2: captcha.requiresV2 },
      { status: captcha.requiresV2 ? 422 : 400 }
    );
  }

  const destination = process.env.SMTP_USER || process.env.SMTP_FROM;
  if (destination) {
    await sendEmail({
      to: destination,
      subject: `Leah Paws contact from ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`
    });
  }

  return NextResponse.json({ ok: true });
}
