import { NextResponse } from "next/server";
import { getSitter } from "@/lib/data";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { saveBooking } from "@/lib/store";
import { bookingReference } from "@/lib/utils";
import { bookingSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the booking details", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const captcha = await verifyRecaptcha(data.recaptchaToken, "booking_create", data.recaptchaV2Token);
  if (!captcha.ok) {
    return NextResponse.json(
      { error: captcha.reason ?? "Could not verify that request", requiresV2: captcha.requiresV2 },
      { status: captcha.requiresV2 ? 422 : 400 }
    );
  }

  const sitter = getSitter(data.sitterUsername);
  if (!sitter) return NextResponse.json({ error: "That sitter is no longer available" }, { status: 404 });

  const reference = bookingReference();
  const record = await saveBooking({
    reference,
    service: data.service,
    sitterUsername: sitter.username,
    sitterName: sitter.name,
    startDate: data.startDate,
    endDate: data.endDate,
    startTime: data.startTime,
    endTime: data.endTime,
    petName: data.petName,
    petSpecies: data.petSpecies,
    ownerName: data.ownerName,
    ownerEmail: data.ownerEmail,
    ownerPhone: data.ownerPhone,
    address: data.address,
    status: "upcoming",
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ booking: record, reference }, { status: 201 });
}
