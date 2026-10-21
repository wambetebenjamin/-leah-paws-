import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock3, MapPin, PawPrint, ShieldCheck, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { getService, getSitter } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const sitter = getSitter(username);
  return { title: sitter ? `${sitter.name}, Pet sitter` : "Sitter not found" };
}

export default async function SitterProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const sitter = getSitter(username);
  if (!sitter) notFound();

  return (
    <>
      <section className="page-hero">
        <div className="site-container page-hero-content">
          <p className="eyebrow">Meet your sitter</p>
          <h1>Care with a personal touch.</h1>
          <p>Get to know the person behind every thoughtful pet update.</p>
        </div>
      </section>
      <section className="section">
        <div className="site-container profile-layout">
          <div>
            <div className="profile-intro">
              <Image className="profile-image" src={sitter.image} alt={`${sitter.name}, Leah Paws sitter`} width={420} height={420} priority />
              <div>
                <div className="profile-name-row"><h1>{sitter.name}</h1><span className="verified-badge"><BadgeCheck size={15} aria-hidden="true" /> Verified</span></div>
                <div className="profile-meta">
                  <span><MapPin size={16} aria-hidden="true" /> {sitter.location}</span>
                  <span><Star size={16} fill="currentColor" aria-hidden="true" /> {sitter.rating} from {sitter.reviewCount} reviews</span>
                  <span><Clock3 size={16} aria-hidden="true" /> {sitter.responseTime}</span>
                </div>
                <p className="profile-bio">{sitter.bio}</p>
              </div>
            </div>

            <section className="profile-section">
              <h2>Services offered</h2>
              <div className="chip-list">{sitter.services.map((service) => <span className="chip" key={service}><PawPrint size={15} aria-hidden="true" /> {getService(service).name}</span>)}</div>
            </section>

            <section className="profile-section">
              <h2>Pets I welcome</h2>
              <div className="chip-list">{sitter.petTypes.map((pet) => <span className="chip green" key={pet}>{pet}</span>)}</div>
            </section>

            <section className="profile-section">
              <h2>Experience and training</h2>
              <p>{sitter.experienceYears} years of hands on pet care experience, with a focus on calm routines and clear owner communication.</p>
              <div className="chip-list" style={{ marginTop: "1rem" }}>{sitter.certifications.map((certificate) => <span className="chip" key={certificate}><ShieldCheck size={15} aria-hidden="true" /> {certificate}</span>)}</div>
            </section>

            <section className="profile-section">
              <h2>Reviews from pet parents</h2>
              {sitter.reviews.map((review) => (
                <article className="review-card" key={`${review.name}-${review.date}`}>
                  <div className="review-topline"><h3>{review.name} and {review.petName}</h3><span>{Array.from({ length: review.rating }, (_, index) => <Star key={index} size={15} fill="currentColor" aria-hidden="true" />)}</span></div>
                  <span className="review-date">{review.date}</span>
                  <p>{review.comment}</p>
                </article>
              ))}
            </section>
          </div>

          <aside className="profile-sidebar-card">
            <p className="eyebrow">Starting at</p>
            <h2>{sitter.priceLabel}</h2>
            <p>Choose a date that works, then tell us a little about your pet.</p>
            <div className="sidebar-stat"><span>Reply time</span><strong>{sitter.responseTime}</strong></div>
            <div className="sidebar-stat"><span>Meet and greet</span><strong>Free</strong></div>
            <Link className="button button-primary full-button" href={`/booking?sitter=${sitter.username}`}>Book {sitter.name.split(" ")[0]}</Link>
          </aside>
        </div>
      </section>
      <section className="section section-light">
        <div className="site-container" style={{ maxWidth: "680px" }}>
          <div className="section-heading centered"><p className="eyebrow">Plan ahead</p><h2>Availability calendar</h2><p>Green dates are available to request. Your booking is confirmed after the sitter accepts.</p></div>
          <AvailabilityCalendar availableDates={sitter.availability} unavailableDates={sitter.unavailableDates} />
        </div>
      </section>
    </>
  );
}
