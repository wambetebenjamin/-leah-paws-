"use client";

import Link from "next/link";
import { MessageCircle, RotateCcw } from "lucide-react";

export function ServerErrorContent({ reset }: { reset?: () => void }) {
  return <section className="not-found-section"><div><span className="not-found-icon"><RotateCcw size={44} aria-hidden="true" /></span><p className="eyebrow">We need a quick moment</p><h1>Something went wrong on our walk.</h1><p>Please try again. If you need a hand with a booking, our team is ready on WhatsApp at +254 112 272 061.</p><div className="confirmation-actions">{reset ? <button className="button button-primary" type="button" onClick={reset}>Try Again</button> : <Link className="button button-primary" href="/">Try Again</Link>}<a className="button button-outline" href="https://wa.me/254112272061?text=Hello%20Leah%20Paws%2C%20I%20need%20help%20with%20a%20booking."><MessageCircle size={16} aria-hidden="true" /> WhatsApp us</a></div></div></section>;
}
