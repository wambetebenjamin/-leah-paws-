import type { Metadata } from "next";
import { BadgeCheck, Camera, HeartHandshake, ShieldCheck } from "lucide-react";
import { SitterApplicationForm } from "@/components/sitter-application-form";

export const metadata: Metadata = { title: "Become a sitter", description: "Apply to care for Nairobi pets with Leah Paws." };

export default function BecomeASitterPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container page-hero-content"><p className="eyebrow">Turn your pet love into meaningful care</p><h1>Become a Leah Paws sitter.</h1><p>Build a flexible care routine around your life while helping Nairobi pets feel safe, seen and happy.</p></div></section>
      <section className="section section-light"><div className="site-container application-layout"><aside className="application-aside"><p className="eyebrow">Care with confidence</p><h2>We look for people who lead with kindness.</h2><p>Whether you are a skilled dog walker, a patient cat person or a natural with small pets, we would love to hear about your experience.</p><ul className="aside-list"><li><BadgeCheck size={20} aria-hidden="true" /> A thoughtful profile that helps owners know you.</li><li><ShieldCheck size={20} aria-hidden="true" /> A background check for every accepted sitter.</li><li><Camera size={20} aria-hidden="true" /> Care updates that make an owner&apos;s day.</li><li><HeartHandshake size={20} aria-hidden="true" /> Friendly support from the Leah Paws team.</li></ul></aside><SitterApplicationForm /></div></section>
    </>
  );
}
