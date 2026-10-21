import type { Metadata } from "next";
import { SitterDirectory } from "@/components/sitter-directory";

export const metadata: Metadata = {
  title: "Find a sitter",
  description: "Explore background checked pet sitters and dog walkers across Nairobi."
};

export default function SittersPage() {
  return (
    <>
      <section className="page-hero">
        <div className="site-container page-hero-content">
          <p className="eyebrow">The right person is nearby</p>
          <h1>Find your pet&apos;s next favourite human.</h1>
          <p>Filter friendly, trusted local sitters by care type, pet type, neighbourhood and availability.</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="site-container"><SitterDirectory /></div>
      </section>
    </>
  );
}
