import type { Metadata } from "next";
import { BadgeCheck, Camera, HeartHandshake } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return <section className="section section-light"><div className="site-container auth-layout"><aside className="auth-aside"><p className="eyebrow">A friendly start</p><h2>Good care begins with a good match.</h2><p>Create an account to book caring help for your pet, or apply your experience to care for Nairobi&apos;s pets.</p><ul className="aside-list"><li><BadgeCheck size={20} aria-hidden="true" /> Background checked people who care deeply.</li><li><Camera size={20} aria-hidden="true" /> Easy booking and friendly care updates.</li><li><HeartHandshake size={20} aria-hidden="true" /> Free meet and greet before a first booking.</li></ul></aside><AuthForm mode="signup" /></div></section>;
}
