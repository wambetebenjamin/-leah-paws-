import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBooking } from "@/lib/store";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { reviewSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in is required" }, { status: 401 });
  if (session.user.role !== "owner") return NextResponse.json({ error: "Only pet owners can leave reviews" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please add a rating and review" }, { status: 400 });

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, "booking_review", parsed.data.recaptchaV2Token);
  if (!captcha.ok) {
    return NextResponse.json({ error: captcha.reason ?? "Could not verify that request", requiresV2: captcha.requiresV2 }, { status: captcha.requiresV2 ? 422 : 400 });
  }

  const booking = await getBooking(parsed.data.bookingReference);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.ownerEmail !== session.user.email) return NextResponse.json({ error: "You cannot review this booking" }, { status: 403 });
  if (booking.status !== "past") return NextResponse.json({ error: "Reviews are available after the session" }, { status: 409 });

  return NextResponse.json({ ok: true, message: "Thank you for your review" }, { status: 201 });
}
