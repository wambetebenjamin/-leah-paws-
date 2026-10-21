"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { RecaptchaV2Fallback, getRecaptchaToken } from "@/components/recaptcha";

export function ReviewForm({ bookingReference }: { bookingReference: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setMessage("");
    try {
      const recaptchaToken = await getRecaptchaToken("booking_review");
      const response = await fetch("/api/booking/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingReference, rating, comment, recaptchaToken, recaptchaV2Token: v2Token || undefined })
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.requiresV2) setNeedsV2(true);
        throw new Error(result.error || "Your review could not be saved.");
      }
      setMessage("Thank you. Your review is now with the Leah Paws community.");
      setComment("");
      setNeedsV2(false);
      setV2Token("");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Your review could not be saved.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="review-form">
      <div className="field-label">Your rating</div>
      <div className="rating-picker" aria-label="Choose a rating">
        {[1, 2, 3, 4, 5].map((value) => <button key={value} className={value <= rating ? "selected" : ""} type="button" onClick={() => setRating(value)} aria-label={`${value} star rating`}><Star size={21} fill="currentColor" aria-hidden="true" /></button>)}
      </div>
      <div className="form-field"><label htmlFor="review-comment">Share a few words</label><textarea id="review-comment" required value={comment} onChange={(event) => setComment(event.target.value)} placeholder="How did your pet's care go?" /></div>
      {needsV2 && <RecaptchaV2Fallback onVerify={(token) => { setV2Token(token); setMessage(""); }} />}
      <button className="button button-primary" type="submit" disabled={sending || (needsV2 && !v2Token)}>{sending ? "Saving..." : "Post review"}</button>
      {message && <p className={message.startsWith("Thank") ? "form-success" : "form-error"}>{message}</p>}
    </form>
  );
}
