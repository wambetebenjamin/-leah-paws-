"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { getService } from "@/lib/data";
import type { Sitter } from "@/lib/types";

export function SitterCard({ sitter, compact = false }: { sitter: Sitter; compact?: boolean }) {
  return (
    <motion.article className={`sitter-card ${compact ? "sitter-card-compact" : ""}`} whileHover={{ y: -9 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
      <Link href={`/sitters/${sitter.username}`} className="sitter-photo-link" aria-label={`View ${sitter.name}'s profile`}>
        <Image className="sitter-photo" src={sitter.image} alt={`${sitter.name}, Leah Paws pet sitter`} width={560} height={500} />
      </Link>
      <div className="sitter-card-body">
        <div className="sitter-title-row">
          <div>
            <h3><Link href={`/sitters/${sitter.username}`}>{sitter.name}</Link></h3>
            <p className="sitter-location"><MapPin size={14} aria-hidden="true" /> {sitter.location}</p>
          </div>
          <span className="rating"><Star size={15} fill="currentColor" aria-hidden="true" /> {sitter.rating}</span>
        </div>
        <p className="sitter-services">{sitter.services.slice(0, 3).map((service) => getService(service).shortName).join(" · ")}</p>
        <div className="sitter-card-bottom">
          <span><strong>{sitter.priceLabel}</strong><small>{sitter.reviewCount} reviews</small></span>
          <Link className="button button-primary button-small" href={`/booking?sitter=${sitter.username}`}>Book</Link>
        </div>
      </div>
    </motion.article>
  );
}
