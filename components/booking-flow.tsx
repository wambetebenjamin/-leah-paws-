"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RecaptchaV2Fallback, getRecaptchaToken } from "@/components/recaptcha";
import { getService, sitters, services } from "@/lib/data";
import type { ServiceId } from "@/lib/types";

const steps = ["Service", "Sitter", "Dates", "Pet", "Your details", "Confirm"];

type BookingFormState = {
  service: ServiceId;
  sitterUsername: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  petSpecies: string;
  petName: string;
  petAge: string;
  petBreed: string;
  specialNeeds: string;
  vetContact: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  address: string;
};

const defaults: BookingFormState = {
  service: "dog-walking",
  sitterUsername: "wambui-wanjiku",
  startDate: "2026-10-23",
  endDate: "2026-10-23",
  startTime: "10:00",
  endTime: "11:00",
  petSpecies: "Dog",
  petName: "",
  petAge: "",
  petBreed: "",
  specialNeeds: "",
  vetContact: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  address: ""
};

export function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingFormState>(defaults);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");

  useEffect(() => {
    const requestedService = searchParams.get("service") as ServiceId | null;
    const requestedSitter = searchParams.get("sitter");
    setForm((current) => ({
      ...current,
      service: services.some((item) => item.id === requestedService) ? requestedService as ServiceId : current.service,
      sitterUsername: sitters.some((item) => item.username === requestedSitter) ? requestedSitter as string : current.sitterUsername
    }));
  }, [searchParams]);

  const update = <Key extends keyof BookingFormState>(key: Key, value: BookingFormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validateStep = () => {
    if (step === 1 && !form.service) return "Choose a service to continue.";
    if (step === 2 && !form.sitterUsername) return "Choose a sitter to continue.";
    if (step === 3 && (!form.startDate || !form.endDate || !form.startTime || !form.endTime)) return "Add your preferred dates and times.";
    if (step === 4 && (!form.petName || !form.petAge || !form.petBreed || !form.vetContact)) return "Tell us a little more about your pet and vet contact.";
    if (step === 5 && (!form.ownerName || !form.ownerEmail || !form.ownerPhone || !form.address)) return "Add your contact details and home address.";
    return "";
  };

  const next = () => {
    const problem = validateStep();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setStep((current) => Math.min(6, current + 1));
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const recaptchaToken = await getRecaptchaToken("booking_create");
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken, recaptchaV2Token: v2Token || undefined })
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.requiresV2) setNeedsV2(true);
        throw new Error(result.error || "Your booking could not be created just now.");
      }
      window.sessionStorage.setItem("leah_paws_last_booking", JSON.stringify(result.booking));
      router.push(`/booking-confirmation?ref=${encodeURIComponent(result.reference)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your booking could not be created just now.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSitter = sitters.find((sitter) => sitter.username === form.sitterUsername) ?? sitters[0];
  const serviceSitters = sitters.filter((sitter) => sitter.services.includes(form.service));

  return (
    <div className="booking-shell">
      <div className="booking-progress" aria-label={`Booking step ${step} of 6`}>
        {steps.map((label, index) => <div key={label} data-step={index + 1} className={`progress-step ${step === index + 1 ? "active" : step > index + 1 ? "complete" : ""}`}>{label}</div>)}
      </div>
      <div className="booking-card">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -26 }} transition={{ duration: 0.25 }}>
            {step === 1 && <ServiceStep form={form} onService={(service) => update("service", service)} />}
            {step === 2 && <SitterStep form={form} sitters={serviceSitters} onSitter={(sitterUsername) => update("sitterUsername", sitterUsername)} />}
            {step === 3 && <DateStep form={form} update={update} />}
            {step === 4 && <PetStep form={form} update={update} />}
            {step === 5 && <OwnerStep form={form} update={update} />}
            {step === 6 && <ReviewStep form={form} sitterName={selectedSitter.name} />}
          </motion.div>
        </AnimatePresence>

        {error && <p className="form-error" role="alert">{error}</p>}
        {needsV2 && <RecaptchaV2Fallback onVerify={(token) => { setV2Token(token); setError(""); }} />}

        <div className="form-actions">
          {step > 1 ? <button className="button button-outline" type="button" onClick={() => { setError(""); setStep((current) => current - 1); }}><ArrowLeft size={16} aria-hidden="true" /> Back</button> : <span />}
          {step < 6 ? <button className="button button-primary" type="button" onClick={next}>Continue <ArrowRight size={16} aria-hidden="true" /></button> : <button className="button button-primary" type="button" onClick={submit} disabled={submitting || (needsV2 && !v2Token)}>{submitting ? "Confirming..." : "Confirm and pay with M Pesa"} <CheckCircle2 size={16} aria-hidden="true" /></button>}
        </div>
      </div>
    </div>
  );
}

function ServiceStep({ form, onService }: { form: BookingFormState; onService: (service: ServiceId) => void }) {
  return <><h2>What kind of care does your pet need?</h2><p className="step-description">You can tell us the finer details in a moment.</p><div className="booking-service-options">{services.map((service) => <button type="button" className={`booking-service-option ${form.service === service.id ? "selected" : ""}`} key={service.id} onClick={() => onService(service.id)}><strong>{service.name}</strong><small>{service.duration ?? service.description}</small><small>{service.price}</small></button>)}</div></>;
}

function SitterStep({ form, sitters: matchingSitters, onSitter }: { form: BookingFormState; sitters: typeof sitters; onSitter: (username: string) => void }) {
  return <><h2>Choose someone your pet will love</h2><p className="step-description">All Leah Paws sitters are background checked and pet first aid trained.</p><div className="sitter-choice-grid">{matchingSitters.map((sitter) => <button type="button" className={`sitter-choice ${form.sitterUsername === sitter.username ? "selected" : ""}`} key={sitter.username} onClick={() => onSitter(sitter.username)}><Image src={sitter.image} width={110} height={110} alt="" /><span><strong>{sitter.name}</strong><small>{sitter.location}</small><small>{sitter.priceLabel}</small></span><span>★ {sitter.rating}</span></button>)}</div></>;
}

function DateStep({ form, update }: { form: BookingFormState; update: <Key extends keyof BookingFormState>(key: Key, value: BookingFormState[Key]) => void }) {
  return <><h2>When should care begin?</h2><p className="step-description">Request your ideal time. Your sitter will confirm availability before the booking is final.</p><div className="form-grid"><div className="form-field"><label htmlFor="start-date">Start date</label><input id="start-date" type="date" min="2026-10-21" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} /></div><div className="form-field"><label htmlFor="end-date">End date</label><input id="end-date" type="date" min={form.startDate || "2026-10-21"} value={form.endDate} onChange={(event) => update("endDate", event.target.value)} /></div><div className="form-field"><label htmlFor="start-time">Start time</label><input id="start-time" type="time" value={form.startTime} onChange={(event) => update("startTime", event.target.value)} /></div><div className="form-field"><label htmlFor="end-time">End time</label><input id="end-time" type="time" value={form.endTime} onChange={(event) => update("endTime", event.target.value)} /></div></div></>;
}

function PetStep({ form, update }: { form: BookingFormState; update: <Key extends keyof BookingFormState>(key: Key, value: BookingFormState[Key]) => void }) {
  return <><h2>Tell us about your pet</h2><p className="step-description">A few details help your sitter give the best possible care.</p><div className="form-grid"><div className="form-field"><label htmlFor="pet-species">Species</label><select id="pet-species" value={form.petSpecies} onChange={(event) => update("petSpecies", event.target.value)}><option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option><option>Guinea Pig</option></select></div><div className="form-field"><label htmlFor="pet-name">Pet&apos;s name</label><input id="pet-name" value={form.petName} onChange={(event) => update("petName", event.target.value)} placeholder="For example, Milo" /></div><div className="form-field"><label htmlFor="pet-age">Age</label><input id="pet-age" value={form.petAge} onChange={(event) => update("petAge", event.target.value)} placeholder="For example, 4 years" /></div><div className="form-field"><label htmlFor="pet-breed">Breed</label><input id="pet-breed" value={form.petBreed} onChange={(event) => update("petBreed", event.target.value)} placeholder="For example, Labrador mix" /></div><div className="form-field full"><label htmlFor="special-needs">Special needs or routines</label><textarea id="special-needs" value={form.specialNeeds} onChange={(event) => update("specialNeeds", event.target.value)} placeholder="Food, medicine, walking preferences or anything else your sitter should know" /></div><div className="form-field full"><label htmlFor="vet-contact">Vet contact</label><input id="vet-contact" value={form.vetContact} onChange={(event) => update("vetContact", event.target.value)} placeholder="Clinic name and phone number" /></div></div></>;
}

function OwnerStep({ form, update }: { form: BookingFormState; update: <Key extends keyof BookingFormState>(key: Key, value: BookingFormState[Key]) => void }) {
  return <><h2>How should we reach you?</h2><p className="step-description">We will only share your details with your confirmed sitter for this booking.</p><div className="form-grid"><div className="form-field"><label htmlFor="owner-name">Your name</label><input id="owner-name" autoComplete="name" value={form.ownerName} onChange={(event) => update("ownerName", event.target.value)} /></div><div className="form-field"><label htmlFor="owner-phone">Phone number</label><input id="owner-phone" type="tel" autoComplete="tel" value={form.ownerPhone} onChange={(event) => update("ownerPhone", event.target.value)} placeholder="+254..." /></div><div className="form-field full"><label htmlFor="owner-email">Email address</label><input id="owner-email" type="email" autoComplete="email" value={form.ownerEmail} onChange={(event) => update("ownerEmail", event.target.value)} placeholder="you@example.com" /></div><div className="form-field full"><label htmlFor="address">Home address for visits</label><textarea id="address" autoComplete="street-address" value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Building, street, neighbourhood and any helpful directions" /></div></div></>;
}

function ReviewStep({ form, sitterName }: { form: BookingFormState; sitterName: string }) {
  const service = getService(form.service);
  return <><h2>One last look before we confirm</h2><p className="step-description">You will pay securely with M Pesa once the sitter accepts your booking request.</p><div className="booking-review-grid"><Summary title="Service" value={service.name} /><Summary title="Sitter" value={sitterName} /><Summary title="When" value={`${form.startDate} at ${form.startTime} to ${form.endDate} at ${form.endTime}`} /><Summary title="Pet" value={`${form.petName || "Your pet"}, ${form.petSpecies}`} /><Summary title="Owner" value={form.ownerName || "Your name"} /><Summary title="Contact" value={form.ownerPhone || "Your phone"} /></div><div className="payment-choice"><CreditCard size={28} color="#00bd56" aria-hidden="true" /><span><strong>M Pesa payment</strong><p>You will receive a secure payment prompt after the sitter confirms.</p></span></div><p className="form-note"><ShieldCheck size={16} aria-hidden="true" /> Your booking is protected by Leah Paws verification and secure payment handling.</p></>;
}

function Summary({ title, value }: { title: string; value: string }) {
  return <div className="review-summary-card"><strong>{title}</strong><span>{value}</span></div>;
}
