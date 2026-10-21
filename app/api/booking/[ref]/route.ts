import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBooking } from "@/lib/store";

export async function GET(_request: Request, { params }: { params: Promise<{ ref: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in is required" }, { status: 401 });

  const { ref } = await params;
  const booking = await getBooking(ref);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  if (session.user.role === "owner" && session.user.email && booking.ownerEmail !== session.user.email) {
    return NextResponse.json({ error: "You cannot view this booking" }, { status: 403 });
  }

  return NextResponse.json({ booking });
}
