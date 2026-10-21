import type { Metadata } from "next";
import { BadgeCheck, Camera, HeartHandshake } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return <section className="section section-light"><div className="site-container auth-layout"><aside className="auth-aside"><p className="eyebrow">Leah Paws community</p><h2>Care feels easier when you are connected.</h2><p>Sign in to view booking details, receive photo updates and keep your pet&apos;s routine in one place.</p><ul className="aside-list"><li><BadgeCheck size={20} aria-hidden="true" /> Trusted local care, checked before every listing.</li><li><Camera size={20} aria-hidden="true" /> Photo updates that bring you closer to the day.</li><li><HeartHandshake size={20} aria-hidden="true" /> Helpful humans ready when you need support.</li></ul></aside><AuthForm mode="signin" /></div></section>;
}
