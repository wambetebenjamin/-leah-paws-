import Link from "next/link";
import { Home, PawPrint } from "lucide-react";

export function NotFoundContent() {
  return <section className="not-found-section"><div><span className="not-found-icon"><PawPrint size={48} aria-hidden="true" /></span><p className="eyebrow">A little detour</p><h1>This page wandered off.</h1><p>It may be chasing a tennis ball somewhere. Let&apos;s get you back to trusted pet care.</p><Link className="button button-primary" href="/"><Home size={17} aria-hidden="true" /> Back to Home</Link></div></section>;
}
