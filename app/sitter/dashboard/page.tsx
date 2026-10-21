import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SitterDashboardClient } from "@/components/sitter-dashboard-client";

export const metadata: Metadata = { title: "Sitter dashboard" };

export default async function SitterDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/sitter/dashboard");
  if (session.user.role !== "sitter") redirect("/my-bookings");

  return (
    <section className="section section-light"><div className="site-container">
      <div className="dashboard-header"><div><p className="eyebrow">Sitter dashboard</p><h1>Good morning, {session.user.name || "sitter"}.</h1><p>Everything you need for a caring, organised pet care week.</p></div></div>
      <div className="dashboard-stats"><article className="stat-card"><span>Upcoming bookings</span><strong>5</strong></article><article className="stat-card"><span>Earnings this month</span><strong>KSh 42,800</strong></article><article className="stat-card"><span>Rating average</span><strong>4.9 / 5</strong></article></div>
      <SitterDashboardClient />
    </div></section>
  );
}
