import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = { title: "Book pet care", description: "Book trusted pet sitting, dog walking and pet care in Nairobi." };

export default function BookingPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container page-hero-content"><p className="eyebrow">Your pet&apos;s plan starts here</p><h1>Book care in a few easy steps.</h1><p>Choose your service, pick a sitter and share the details that help them care well.</p></div></section>
      <section className="section section-light"><Suspense fallback={<div className="booking-shell"><div className="booking-card">Preparing your booking form...</div></div>}><BookingFlow /></Suspense></section>
    </>
  );
}
