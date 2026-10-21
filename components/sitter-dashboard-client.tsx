"use client";

import { motion } from "framer-motion";
import { CalendarDays, Check, ImagePlus, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { demoCareUpdates } from "@/lib/data";
import { classNames } from "@/lib/utils";
import { RecaptchaV2Fallback, getRecaptchaToken } from "@/components/recaptcha";

const monthDays = Array.from({ length: 31 }, (_, index) => index + 1);

export function SitterDashboardClient() {
  const [available, setAvailable] = useState<number[]>([22, 23, 24, 26, 27, 28, 30]);
  const [saved, setSaved] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");

  const unavailable = useMemo(() => monthDays.filter((day) => !available.includes(day)), [available]);

  const toggleDate = (day: number) => {
    setSaved(false);
    setAvailable((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort((a, b) => a - b));
  };

  const upload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!photo || !updateMessage.trim()) {
      setUploadStatus("Add a photo and a short update for the pet owner.");
      return;
    }
    setUploadStatus("Uploading your care update...");
    const formData = new FormData();
    formData.set("bookingReference", "LP-10624");
    formData.set("message", updateMessage);
    formData.set("photo", photo);
    const recaptchaToken = await getRecaptchaToken("care_update");
    formData.set("recaptchaToken", recaptchaToken);
    if (v2Token) formData.set("recaptchaV2Token", v2Token);
    try {
      const response = await fetch("/api/care-update/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) {
        if (result.requiresV2) setNeedsV2(true);
        throw new Error(result.error || "Could not upload your care update.");
      }
      setUploadStatus("Care update sent to the owner.");
      setUpdateMessage("");
      setPhoto(null);
      setNeedsV2(false);
      setV2Token("");
    } catch (caught) {
      setUploadStatus(caught instanceof Error ? caught.message : "Could not upload your care update.");
    }
  };

  return (
    <div className="dashboard-layout">
      <div>
        <section className="dashboard-card">
          <h2>Upcoming bookings</h2>
          <div className="booking-list-item"><div><strong>Milo, Dog Walking</strong><small>Tomorrow, 10:00 AM to 11:00 AM</small><span className="booking-status">Confirmed</span></div><button className="button button-outline button-small" type="button">View details</button></div>
          <div className="booking-list-item"><div><strong>Koko, Home Sitting</strong><small>24 October, 6:00 PM to 26 October, 6:00 PM</small><span className="booking-status">Upcoming</span></div><button className="button button-outline button-small" type="button">View details</button></div>
        </section>
        <section className="dashboard-card">
          <h2>Send a care update</h2>
          <p>Share a reassuring note and photo with a pet owner during an active booking.</p>
          <form onSubmit={upload} className="form-grid">
            <div className="form-field full"><label htmlFor="care-message">Your update for Milo&apos;s owner</label><textarea id="care-message" value={updateMessage} onChange={(event) => setUpdateMessage(event.target.value)} placeholder="Tell them about the walk, food, playtime or rest..." /></div>
            <div className="form-field full"><label htmlFor="care-photo">Photo</label><input id="care-photo" type="file" accept="image/*" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} /><small className="upload-hint"><ImagePlus size={15} aria-hidden="true" /> {photo ? photo.name : "Photos are stored safely with Vercel Blob when live."}</small></div>
            <div className="form-field full">{needsV2 && <RecaptchaV2Fallback onVerify={(token) => { setV2Token(token); setUploadStatus(""); }} />}<button className="button button-primary" type="submit" disabled={needsV2 && !v2Token}><Upload size={16} aria-hidden="true" /> Send care update</button>{uploadStatus && <p className={uploadStatus.startsWith("Care") ? "form-success" : "form-note"}>{uploadStatus}</p>}</div>
          </form>
          <motion.article initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="care-log-preview">
            <p className="eyebrow">Latest owner update</p><img className="care-update-image" src={demoCareUpdates[0].photoUrl} alt="Happy dog outdoors during care update" /><strong>{demoCareUpdates[0].createdAt}</strong><p>{demoCareUpdates[0].message}</p>
          </motion.article>
        </section>
      </div>
      <div>
        <section className="dashboard-card">
          <h2><CalendarDays size={21} aria-hidden="true" /> Set availability</h2>
          <p>Tap a date to toggle it between available and unavailable.</p>
          <div className="dashboard-calendar"><div className="dashboard-calendar-title">October 2026</div><div className="dashboard-calendar-week">{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="dashboard-calendar-days">{Array.from({ length: 4 }, (_, index) => <span key={`blank-${index}`} />)}{monthDays.map((day) => <button className={classNames(available.includes(day) && "available", unavailable.includes(day) && "unavailable")} type="button" key={day} onClick={() => toggleDate(day)}>{day}</button>)}</div></div>
          <button className="button button-primary full-button" type="button" onClick={() => setSaved(true)}><Check size={16} aria-hidden="true" /> Save availability</button>
          {saved && <p className="form-success">Your October availability is saved for this session.</p>}
        </section>
        <section className="dashboard-card">
          <h2>Payout history</h2>
          <div className="table-wrap"><table><thead><tr><th>Date</th><th>Period</th><th>Amount</th><th>Status</th></tr></thead><tbody><tr><td>17 Oct</td><td>1 to 15 Oct</td><td>KSh 18,400</td><td>Paid</td></tr><tr><td>2 Oct</td><td>16 to 30 Sep</td><td>KSh 14,250</td><td>Paid</td></tr><tr><td>Pending</td><td>16 to 31 Oct</td><td>KSh 9,600</td><td>Processing</td></tr></tbody></table></div>
        </section>
      </div>
    </div>
  );
}
