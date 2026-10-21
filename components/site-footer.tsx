import Link from "next/link";
import { Heart, Mail, MapPin, PawPrint, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <section>
          <Link className="footer-brand" href="/">
            <PawPrint size={28} aria-hidden="true" /> Leah Paws
          </Link>
          <p>Happy pets. Worry-free owners.</p>
          <p className="footer-small">Trusted pet sitting, dog walking and care booking for Nairobi families.</p>
        </section>
        <section>
          <h2>Explore</h2>
          <Link href="/sitters">Find a sitter</Link>
          <Link href="/booking">Book pet care</Link>
          <Link href="/become-a-sitter">Become a sitter</Link>
          <Link href="/my-bookings">My bookings</Link>
        </section>
        <section>
          <h2>Get in touch</h2>
          <a href="tel:+254112272061"><Phone size={15} aria-hidden="true" /> +254 112 272 061</a>
          <a href="mailto:hello@leahpaws.co.ke"><Mail size={15} aria-hidden="true" /> hello@leahpaws.co.ke</a>
          <p><MapPin size={15} aria-hidden="true" /> Nairobi, Kenya</p>
        </section>
        <section>
          <h2>Legal</h2>
          <Link href="/legal/privacy-policy">Privacy policy</Link>
          <Link href="/legal/terms">Terms of service</Link>
          <Link href="/legal/cookie-policy">Cookie policy</Link>
        </section>
      </div>
      <div className="site-container footer-bottom">
        <span>© {new Date().getFullYear()} Leah Paws. Made with care in Nairobi.</span>
        <span><Heart size={15} fill="currentColor" aria-hidden="true" /> Pet first, always.</span>
      </div>
    </footer>
  );
}
