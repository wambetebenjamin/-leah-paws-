"use client";

import Link from "next/link";
import { CarFront, Dog, Home, Scissors, ShieldCheck, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { services } from "@/lib/data";
import type { ServiceId } from "@/lib/types";

const icons: Record<ServiceId, typeof Dog> = {
  "dog-walking": Dog,
  "home-sitting": Home,
  boarding: ShieldCheck,
  "doggy-day-care": Sun,
  "pet-taxi": CarFront,
  "grooming-referral": Scissors
};

export function ServiceGrid() {
  return (
    <div className="service-grid">
      {services.map((service, index) => {
        const Icon = icons[service.id];
        return (
          <motion.article
            className="service-card"
            key={service.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
          >
            <div className="service-icon"><Icon size={32} strokeWidth={1.85} aria-hidden="true" /></div>
            <div className="service-card-content">
              <p className="service-duration">{service.duration ?? "Flexible care"}</p>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-bottom">
                <strong>{service.price}</strong>
                <Link href={`/booking?service=${service.id}`}>Book now</Link>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
