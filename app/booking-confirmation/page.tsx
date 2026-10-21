import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingConfirmation } from "@/components/booking-confirmation";

export const metadata: Metadata = { title: "Booking confirmation" };

export default function BookingConfirmationPage() {
  return <section className="section section-light"><Suspense fallback={<div className="booking-shell"><div className="booking-card">Preparing your confirmation...</div></div>}><BookingConfirmation /></Suspense></section>;
}
