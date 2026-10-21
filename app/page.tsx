import Link from "next/link";
import { ArrowRight, BadgeCheck, Bird, Camera, Cat, Dog, Handshake, Headphones, HeartPulse, Mouse, Rabbit } from "lucide-react";
import { HeroParallax } from "@/components/hero-parallax";
import { ServiceGrid } from "@/components/service-grid";
import { SitterCard } from "@/components/sitter-card";
import { sitters } from "@/lib/data";

const careFeatures = [
  { icon: BadgeCheck, title: "Checked sitters", detail: "Every sitter completes our background check before appearing on Leah Paws." },
  { icon: HeartPulse, title: "Pet first aid trained", detail: "Our sitters learn practical first aid basics for calm, prepared care." },
  { icon: Camera, title: "Live photo updates", detail: "See the walk, cuddle or meal time while your pet is in trusted hands." },
  { icon: Headphones, title: "24/7 owner support", detail: "Our Nairobi support team is ready when you need a helpful human." },
  { icon: Handshake, title: "Free meet and greet", detail: "Get comfortable together before your first booking, at no extra cost." }
];

const petTypeCards = [
  { icon: Dog, label: "Dogs" },
  { icon: Cat, label: "Cats" },
  { icon: Bird, label: "Birds" },
  { icon: Rabbit, label: "Rabbits" },
  { icon: Mouse, label: "Guinea Pigs" }
];

const testimonials = [
  { name: "Lilian K.", pet: "Milo's mum, Kilimani", quote: "I booked a walk during a long work day and got the happiest photo update. Milo came home content and sleepy, which says everything." },
  { name: "James O.", pet: "Koko's dad, Westlands", quote: "Our cat normally hides from new people, but Zawadi was patient and gentle. Her daily notes let us relax while we were away." },
  { name: "Amina N.", pet: "Nala's mum, Karen", quote: "The meet and greet made the first booking feel so easy. Leah Paws gave us a sitter who genuinely understands our energetic girl." }
];

export default function HomePage() {
  return (
    <>
      <HeroParallax />

      <section className="section section-light" aria-labelledby="services-title">
        <div className="site-container">
          <div className="section-heading centered">
            <p className="eyebrow">Care that fits your day</p>
            <h2 id="services-title">A little help, a lot of love.</h2>
            <p>Choose trusted care that works around your pet&apos;s routine, from a quick walk to a cozy overnight stay.</p>
          </div>
          <ServiceGrid />
        </div>
      </section>

      <section className="section" aria-labelledby="why-title">
        <div className="site-container split-care">
          <div className="split-image" role="img" aria-label="East African pet sitter sharing a caring moment with a dog" />
          <div>
            <p className="eyebrow">Why Leah Paws</p>
            <h2 id="why-title">Care feels better when it feels personal.</h2>
            <p>We make it easy to find a caring person nearby, check that they are a great fit, then stay connected while your pet is with them.</p>
            <div className="care-feature-grid">
              {careFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article className="care-feature" key={feature.title}>
                    <div className="care-feature-icon"><Icon size={25} strokeWidth={1.9} aria-hidden="true" /></div>
                    <div><h3>{feature.title}</h3><p>{feature.detail}</p></div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-blue" aria-labelledby="how-title">
        <div className="site-container">
          <div className="section-heading centered">
            <p className="eyebrow">Simple from hello to home</p>
            <h2 id="how-title" style={{ color: "#fff" }}>How Leah Paws works</h2>
            <p>Booking trusted pet care should leave you feeling calm, not busy.</p>
          </div>
          <div className="how-grid">
            <article className="how-step"><span className="step-number">1</span><h3>Search nearby</h3><p>Pick a service and Nairobi location that suits your pet.</p></article>
            <article className="how-step"><span className="step-number">2</span><h3>Meet your sitter</h3><p>Read real reviews and choose the profile that feels right.</p></article>
            <article className="how-step"><span className="step-number">3</span><h3>Book and pay</h3><p>Confirm care in minutes and pay simply with M Pesa.</p></article>
            <article className="how-step"><span className="step-number">4</span><h3>Stay close</h3><p>Enjoy care updates while your pet gets the attention they deserve.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-light" aria-labelledby="sitters-title">
        <div className="site-container">
          <div className="section-heading centered">
            <p className="eyebrow">Meet the community</p>
            <h2 id="sitters-title">Featured sitters in Nairobi</h2>
            <p>Kind, capable animal lovers with local knowledge and a caring approach.</p>
          </div>
          <div className="sitter-grid">
            {sitters.map((sitter) => <SitterCard sitter={sitter} key={sitter.username} />)}
          </div>
          <div className="text-link-row"><Link className="text-link" href="/sitters">Meet all sitters <ArrowRight size={17} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className="section" aria-labelledby="pet-types-title">
        <div className="site-container">
          <div className="section-heading centered">
            <p className="eyebrow">Every kind of companion</p>
            <h2 id="pet-types-title">Pets we love caring for</h2>
          </div>
          <div className="pet-types">
            {petTypeCards.map(({ icon: Icon, label }) => <div className="pet-type" key={label}><Icon size={35} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section testimonial-band" aria-labelledby="stories-title">
        <div className="site-container">
          <div className="section-heading centered">
            <p className="eyebrow">Pet parent stories</p>
            <h2 id="stories-title">Owners who can breathe easier</h2>
            <p>Kind words from Nairobi pets and the people who love them.</p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" key={testimonial.name}>
                <p>{testimonial.quote}</p>
                <div className="testimonial-author">
                  <span className="author-avatar">{testimonial.name.split(" ").map((part) => part[0]).join("")}</span>
                  <span><strong>{testimonial.name}</strong><small>{testimonial.pet}</small></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
