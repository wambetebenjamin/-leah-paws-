"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { CalendarPlus, CheckCircle2, Download, MessageCircle, PawPrint } from "lucide-react";
import type { BookingRecord } from "@/lib/types";
import { getService } from "@/lib/data";

const fallbackBooking: BookingRecord = {
  reference: "LP-WELCOME",
  service: "dog-walking",
  sitterUsername: "wambui-wanjiku",
  sitterName: "Wambui Wanjiku",
  startDate: "2026-10-23",
  endDate: "2026-10-23",
  startTime: "10:00",
  endTime: "11:00",
  petName: "Your pet",
  petSpecies: "Dog",
  ownerName: "Pet parent",
  ownerEmail: "",
  ownerPhone: "",
  status: "upcoming",
  createdAt: "2026-10-21T00:00:00.000Z"
};

function calendarDate(date: string, time: string) {
  return `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;
}

export function BookingConfirmation() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingRecord>(fallbackBooking);
  const pawRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("leah_paws_last_booking");
    if (saved) {
      try { setBooking(JSON.parse(saved) as BookingRecord); } catch { /* The welcome state is a safe fallback. */ }
    }
  }, []);

  useEffect(() => {
    if (!pawRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(pawRef.current, { scale: 1.6, rotation: -16, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.62, ease: "back.out(1.7)" });
    });
    return () => context.revert();
  }, []);

  const service = getService(booking.service);
  const ref = searchParams.get("ref") || booking.reference;
  const calendarUrl = useMemo(() => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Leah Paws: ${service.name} for ${booking.petName}`,
      dates: `${calendarDate(booking.startDate, booking.startTime)}/${calendarDate(booking.endDate, booking.endTime)}`,
      details: `Booking reference ${ref}. Your sitter is ${booking.sitterName}.`
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [booking, ref, service.name]);

  const whatsappUrl = `https://wa.me/254112272061?text=${encodeURIComponent(`Hello Leah Paws, I have booking ${ref} with ${booking.sitterName}.`)}`;

  const downloadPdf = async () => {
    const [{ jsPDF }, QRCode] = await Promise.all([import("jspdf"), import("qrcode")]);
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const code = await QRCode.toDataURL(`Booking ${ref} | Leah Paws`);
    doc.setFillColor(0, 189, 86);
    doc.rect(0, 0, 595, 112, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(25);
    doc.text("Leah Paws", 48, 58);
    doc.setFontSize(12);
    doc.text("Happy pets. Worry-free owners.", 48, 82);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(21);
    doc.text("Booking summary", 48, 160);
    doc.setFontSize(12);
    const lines = [
      `Reference: ${ref}`,
      `Pet: ${booking.petName} (${booking.petSpecies})`,
      `Service: ${service.name}`,
      `Sitter: ${booking.sitterName}`,
      `Dates: ${booking.startDate} ${booking.startTime} to ${booking.endDate} ${booking.endTime}`,
      "Payment: M Pesa after sitter confirmation"
    ];
    lines.forEach((line, index) => doc.text(line, 48, 205 + index * 27));
    doc.setFontSize(10);
    doc.text("Keep this summary handy if you need our support team.", 48, 405);
    doc.addImage(code, "PNG", 414, 310, 115, 115);
    doc.save(`leah-paws-${ref}.pdf`);
  };

  return (
    <div className="confirmation-card booking-card">
      <div className="confirmation-paw" ref={pawRef}><PawPrint size={42} aria-hidden="true" /></div>
      <p className="eyebrow">Booking request received</p>
      <h1>You&apos;re all set for now.</h1>
      <p>We sent your request to {booking.sitterName}. We will let you know as soon as they confirm care for {booking.petName}.</p>
      <p className="confirmation-reference">{ref}</p>
      <div className="confirmation-details">
        <p><strong>Service:</strong> {service.name}</p>
        <p><strong>Sitter:</strong> {booking.sitterName}</p>
        <p><strong>Dates:</strong> {booking.startDate} at {booking.startTime} to {booking.endDate} at {booking.endTime}</p>
        <p><strong>Pet:</strong> {booking.petName}</p>
      </div>
      <p className="form-success"><CheckCircle2 size={16} aria-hidden="true" /> M Pesa payment will be requested once your sitter accepts.</p>
      <div className="confirmation-actions">
        <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" /> Contact sitter</a>
        <a className="button button-outline" href={calendarUrl} target="_blank" rel="noreferrer"><CalendarPlus size={16} aria-hidden="true" /> Add to Google Calendar</a>
        <button className="button button-blue" type="button" onClick={downloadPdf}><Download size={16} aria-hidden="true" /> Download summary PDF</button>
      </div>
    </div>
  );
}
