import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarDays, Camera, Star } from "lucide-react";
import { auth } from "@/auth";
import { ReviewForm } from "@/components/review-form";
import { demoCareUpdates } from "@/lib/data";

export const metadata: Metadata = { title: "My bookings" };

const bookingGroups = [
  {
    label: "Active",
    records: [{ reference: "LP-10624", pet: "Milo", service: "Dog walking", sitter: "Wambui Wanjiku", date: "Today, 2:00 PM to 3:00 PM", status: "In care" }]
  },
  {
    label: "Upcoming",
    records: [{ reference: "LP-10625", pet: "Koko", service: "Home sitting", sitter: "Zawadi Mwende", date: "24 Oct, 6:00 PM to 26 Oct, 6:00 PM", status: "Confirmed" }]
  },
  {
    label: "Past",
    records: [{ reference: "LP-10591", pet: "Nala", service: "Doggy day care", sitter: "Brian Otieno", date: "15 Oct, 8:30 AM to 5:00 PM", status: "Completed" }]
  }
];

export default async function MyBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/my-bookings");
  if (session.user.role !== "owner") redirect("/sitter/dashboard");

  return (
    <>
      <section className="page-hero"><div className="site-container page-hero-content"><p className="eyebrow">Your pet care in one place</p><h1>Hi {session.user.name || "pet parent"}, here&apos;s your care plan.</h1><p>Keep track of every walk, stay and happy update from your sitter.</p></div></section>
      <section className="section section-light"><div className="site-container">
        <div className="dashboard-layout">
          <div>
            {bookingGroups.map((group) => <section className="dashboard-card" key={group.label}><h2>{group.label} bookings</h2>{group.records.map((booking) => <div className="booking-list-item" key={booking.reference}><div><strong>{booking.pet}, {booking.service}</strong><small>with {booking.sitter}</small><small><CalendarDays size={14} aria-hidden="true" /> {booking.date}</small><span className="booking-status">{booking.status}</span></div>{group.label === "Active" ? <button className="button button-primary button-small" type="button">View care updates</button> : group.label === "Past" ? <a className="button button-outline button-small" href="#review">Rate and review</a> : <button className="button button-outline button-small" type="button">View details</button>}</div>)}</section>)}
          </div>
          <aside>
            <section className="dashboard-card"><h2><Camera size={20} aria-hidden="true" /> Care updates</h2><p>Little moments from Milo&apos;s active walk.</p>{demoCareUpdates.map((update) => <article key={update.id}><img className="care-update-image" src={update.photoUrl} alt="Happy dog during a care update" /><strong>{update.createdAt}</strong><p>{update.message}</p></article>)}</section>
            <section className="dashboard-card" id="review"><h2><Star size={20} aria-hidden="true" /> Rate a completed session</h2><p>Your kind, honest feedback helps other pet parents choose well.</p><ReviewForm bookingReference="LP-10591" /></section>
          </aside>
        </div>
      </div></section>
    </>
  );
}
