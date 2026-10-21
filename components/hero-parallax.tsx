"use client";

import Link from "next/link";
import { ArrowRight, PawPrint, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroParallax() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const image = imageRef.current;
    if (!hero || !image) return;

    const context = gsap.context(() => {
      gsap.fromTo(image, { yPercent: -4 }, { yPercent: 6, ease: "none", scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true
      } });
    }, hero);

    return () => context.revert();
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-image" ref={imageRef} role="img" aria-label="East African pet owner enjoying time with a happy dog" />
      <div className="hero-overlay" />
      <div className="site-container hero-content">
        <p className="hero-kicker"><PawPrint size={18} aria-hidden="true" /> Nairobi&apos;s trusted pet care community</p>
        <h1>Happy pets.<br />Worry-free owners.</h1>
        <p className="hero-copy">Meet caring, background checked sitters and dog walkers near you. Book a little help or a lot of care, right when your pet needs it.</p>
        <div className="hero-actions">
          <Link className="button button-primary button-large" href="/sitters">Find a sitter <ArrowRight size={17} aria-hidden="true" /></Link>
          <Link className="button button-white button-large" href="/become-a-sitter">Become a sitter</Link>
        </div>
        <div className="hero-trust"><ShieldCheck size={19} aria-hidden="true" /> Background checked sitters and pet first aid training</div>
      </div>
    </section>
  );
}
