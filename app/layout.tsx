import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";
import { LoadingScreen } from "@/components/loading-screen";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { VoiceTour } from "@/components/voice-tour";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://leahpaws.co.ke"),
  title: {
    default: "Leah Paws | Pet sitting and dog walking in Nairobi",
    template: "%s | Leah Paws"
  },
  description: "Find trusted, background checked pet sitters and dog walkers in Nairobi, Kenya.",
  keywords: ["pet sitting Nairobi", "dog walking Nairobi", "Leah Paws", "pet care Kenya"],
  openGraph: {
    title: "Leah Paws",
    description: "Happy pets. Worry-free owners.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <body>
        <LoadingScreen />
        <SmoothScroll />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <CookieConsent />
        <VoiceTour />
        <WhatsAppButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
