"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { neighbourhoods, petTypes, services, sitters } from "@/lib/data";
import { SitterCard } from "@/components/sitter-card";

export function SitterDirectory() {
  const [service, setService] = useState("");
  const [petType, setPetType] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");

  const filtered = useMemo(() => sitters.filter((sitter) => {
    if (service && !sitter.services.includes(service as never)) return false;
    if (petType && !sitter.petTypes.includes(petType as never)) return false;
    if (neighbourhood && !sitter.location.toLowerCase().includes(neighbourhood.toLowerCase())) return false;
    if (date && !sitter.availability.includes(date)) return false;
    if (rating && sitter.rating < Number(rating)) return false;
    if (price) {
      const [min, max] = price.split("-").map(Number);
      if (Number.isFinite(min) && sitter.price < min) return false;
      if (Number.isFinite(max) && sitter.price > max) return false;
    }
    return true;
  }), [service, petType, neighbourhood, price, date, rating]);

  const reset = () => {
    setService("");
    setPetType("");
    setNeighbourhood("");
    setPrice("");
    setDate("");
    setRating("");
  };

  return (
    <div className="directory-layout">
      <aside className="filter-panel" aria-label="Filter sitters">
        <h2><SlidersHorizontal size={20} aria-hidden="true" /> Find your fit</h2>
        <div className="field-group">
          <label htmlFor="service-filter">Service type</label>
          <select id="service-filter" value={service} onChange={(event) => setService(event.target.value)}>
            <option value="">All services</option>
            {services.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label htmlFor="pet-filter">Pet type</label>
          <select id="pet-filter" value={petType} onChange={(event) => setPetType(event.target.value)}>
            <option value="">All pets</option>
            {petTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label htmlFor="neighbourhood-filter">Neighbourhood</label>
          <select id="neighbourhood-filter" value={neighbourhood} onChange={(event) => setNeighbourhood(event.target.value)}>
            <option value="">All Nairobi</option>
            {neighbourhoods.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label htmlFor="price-filter">Price range</label>
          <select id="price-filter" value={price} onChange={(event) => setPrice(event.target.value)}>
            <option value="">Any price</option>
            <option value="0-1000">Up to KSh 1,000</option>
            <option value="1001-1800">KSh 1,001 to 1,800</option>
            <option value="1801-3000">KSh 1,801 to 3,000</option>
          </select>
        </div>
        <div className="field-group">
          <label htmlFor="date-filter">Availability date</label>
          <input id="date-filter" type="date" value={date} min="2026-10-21" onChange={(event) => setDate(event.target.value)} />
        </div>
        <div className="field-group">
          <label htmlFor="rating-filter">Minimum rating</label>
          <select id="rating-filter" value={rating} onChange={(event) => setRating(event.target.value)}>
            <option value="">Any rating</option>
            <option value="4.5">4.5 and above</option>
            <option value="4.8">4.8 and above</option>
            <option value="5">5 only</option>
          </select>
        </div>
        <button className="button button-outline" type="button" onClick={reset}>Clear filters</button>
      </aside>
      <div>
        <div className="filter-result-heading">
          <div><p className="eyebrow">Available locally</p><h2>Pet sitters near you</h2></div>
          <p>{filtered.length} {filtered.length === 1 ? "sitter" : "sitters"} found</p>
        </div>
        {filtered.length > 0 ? (
          <div className="directory-grid">{filtered.map((sitter) => <SitterCard sitter={sitter} key={sitter.username} />)}</div>
        ) : (
          <div className="empty-results"><h3>No exact matches just yet</h3><p>Try a different date, neighbourhood or service. Our community is growing every day.</p><button className="button button-primary" type="button" onClick={reset}>Show all sitters</button></div>
        )}
      </div>
    </div>
  );
}
