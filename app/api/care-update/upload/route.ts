import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBooking, saveCareUpdate } from "@/lib/store";
import { sendEmail } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in is required" }, { status: 401 });
  if (session.user.role !== "sitter") return NextResponse.json({ error: "Only sitters can upload care updates" }, { status: 403 });

  const formData = await request.formData();
  const bookingReference = String(formData.get("bookingReference") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  const photo = formData.get("photo");
  const recaptchaToken = String(formData.get("recaptchaToken") ?? "");
  const recaptchaV2Token = String(formData.get("recaptchaV2Token") ?? "") || undefined;

  if (!bookingReference || !message || !(photo instanceof File)) {
    return NextResponse.json({ error: "A booking, update and photo are required" }, { status: 400 });
  }
  if (!photo.type.startsWith("image/")) {
    return NextResponse.json({ error: "Please upload an image file" }, { status: 400 });
  }

  const captcha = await verifyRecaptcha(recaptchaToken, "care_update", recaptchaV2Token);
  if (!captcha.ok) {
    return NextResponse.json({ error: captcha.reason ?? "Could not verify that request", requiresV2: captcha.requiresV2 }, { status: captcha.requiresV2 ? 422 : 400 });
  }

  const booking = await getBooking(bookingReference);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  let photoUrl = "/images/care-update.jpg";
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`care-updates/${bookingReference}/${Date.now()}-${photo.name}`, photo, {
      access: "public",
      addRandomSuffix: true
    });
    photoUrl = blob.url;
  }

  const update = await saveCareUpdate({
    id: `update-${Date.now()}`,
    bookingReference,
    message,
    photoUrl,
    createdAt: new Date().toISOString()
  });

  await sendEmail({
    to: booking.ownerEmail,
    subject: `A fresh Leah Paws update for ${booking.petName}`,
    text: `${session.user.name ?? "Your sitter"} shared a care update: ${message}\n\nView your booking in Leah Paws for the photo.`
  });

  return NextResponse.json({ update }, { status: 201 });
}
