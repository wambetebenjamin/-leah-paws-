"use client";

import { CheckCircle2, Upload } from "lucide-react";
import { FormEvent, useState } from "react";
import { RecaptchaV2Fallback, getRecaptchaToken } from "@/components/recaptcha";
import { petTypes, services } from "@/lib/data";

export function SitterApplicationForm() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const toggle = (value: string, current: string[], update: (items: string[]) => void) => {
    update(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!selectedServices.length || !selectedPets.length) {
      setMessage("Choose at least one service and pet type you are comfortable with.");
      return;
    }
    setSending(true);
    setMessage("");
    try {
      const recaptchaToken = await getRecaptchaToken("sitter_apply");
      const data = new FormData(form);
      data.set("services", JSON.stringify(selectedServices));
      data.set("petTypes", JSON.stringify(selectedPets));
      data.set("recaptchaToken", recaptchaToken);
      if (v2Token) data.set("recaptchaV2Token", v2Token);
      const response = await fetch("/api/sitter/apply", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) {
        if (result.requiresV2) setNeedsV2(true);
        throw new Error(result.error || "We could not send your application yet.");
      }
      setMessage("Application received. We will be in touch after reviewing your details.");
      form.reset();
      setSelectedServices([]);
      setSelectedPets([]);
      setV2Token("");
      setNeedsV2(false);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "We could not send your application yet.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="application-card" onSubmit={submit}>
      <p className="eyebrow">Your application</p>
      <h1>Tell us how you care.</h1>
      <p>We will review your application carefully and follow up with the next steps.</p>
      <div className="form-grid">
        <div className="form-field"><label htmlFor="application-name">Full name</label><input id="application-name" name="name" autoComplete="name" required /></div>
        <div className="form-field"><label htmlFor="application-phone">Phone</label><input id="application-phone" name="phone" type="tel" autoComplete="tel" required /></div>
        <div className="form-field"><label htmlFor="application-email">Email</label><input id="application-email" name="email" type="email" autoComplete="email" required /></div>
        <div className="form-field"><label htmlFor="application-neighbourhood">Nairobi neighbourhood</label><input id="application-neighbourhood" name="neighbourhood" placeholder="For example, Kilimani" required /></div>
        <div className="form-field full"><span className="field-label">Services you offer</span><div className="multi-select-group">{services.map((service) => <label className="multi-select-option" key={service.id}><input type="checkbox" checked={selectedServices.includes(service.id)} onChange={() => toggle(service.id, selectedServices, setSelectedServices)} /> {service.name}</label>)}</div></div>
        <div className="form-field full"><span className="field-label">Pets you are comfortable with</span><div className="multi-select-group">{petTypes.map((pet) => <label className="multi-select-option" key={pet}><input type="checkbox" checked={selectedPets.includes(pet)} onChange={() => toggle(pet, selectedPets, setSelectedPets)} /> {pet}</label>)}</div></div>
        <div className="form-field"><label htmlFor="application-experience">Years of experience</label><input id="application-experience" name="experienceYears" type="number" min="0" max="60" required /></div>
        <div className="form-field"><label htmlFor="application-certifications">Certifications</label><input id="application-certifications" name="certifications" placeholder="Pet first aid, grooming, or similar" /></div>
        <div className="form-field full"><label htmlFor="application-file">Certificate upload, optional</label><input id="application-file" name="certificationFile" type="file" accept="image/*,.pdf" /><small className="upload-hint"><Upload size={14} aria-hidden="true" /> Uploaded securely to Vercel Blob when live.</small></div>
        <div className="form-field full"><label htmlFor="application-bio">A little about your pet care experience</label><textarea id="application-bio" name="bio" minLength={30} placeholder="Share your experience, approach to pet care and what makes you a thoughtful sitter..." required /></div>
      </div>
      <label className="checkbox-row"><input name="backgroundCheck" type="checkbox" value="true" required /> <span>I agree to Leah Paws carrying out a background check as part of this application.</span></label>
      {needsV2 && <RecaptchaV2Fallback onVerify={(token) => { setV2Token(token); setMessage(""); }} />}
      <button className="button button-primary full-button" type="submit" disabled={sending || (needsV2 && !v2Token)}>{sending ? "Sending application..." : "Submit sitter application"}</button>
      {message && <p className={message.startsWith("Application") ? "form-success" : "form-error"}>{message}</p>}
    </form>
  );
}
