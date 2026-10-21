"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const script =
  "Hey, welcome to Leah Paws. We help Nairobi pet owners find trusted, background checked sitters and dog walkers near them. Whether you need a 30 minute walk, a full day of care, or overnight boarding, book online in minutes, pay with M Pesa, and get live photo updates while your pet is in safe hands. Your pet deserves good care even when you cannot be there. Find your sitter today.";

export function VoiceTour() {
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const started = useRef(false);
  const speakingRef = useRef(false);

  const playTour = useCallback(() => {
    if (!("speechSynthesis" in window) || speakingRef.current) return;
    started.current = true;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.95;
    utterance.pitch = 1.12;
    utterance.lang = "en-KE";
    utterance.onstart = () => {
      speakingRef.current = true;
      setMuted(false);
      setSpeaking(true);
    };
    utterance.onend = () => {
      speakingRef.current = false;
      setSpeaking(false);
      setFinished(true);
    };
    utterance.onerror = () => {
      speakingRef.current = false;
      setSpeaking(false);
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopTour = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    speakingRef.current = false;
    setSpeaking(false);
    setMuted(true);
  }, []);

  useEffect(() => {
    const startOnFirstInteraction = () => {
      if (!started.current) playTour();
    };
    window.addEventListener("scroll", startOnFirstInteraction, { once: true, passive: true });
    document.addEventListener("click", startOnFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("scroll", startOnFirstInteraction);
      document.removeEventListener("click", startOnFirstInteraction);
      window.speechSynthesis?.cancel();
    };
  }, [playTour]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (speakingRef.current) {
      stopTour();
      return;
    }
    playTour();
  };

  const label = speaking
    ? "Site voice tour, click to mute"
    : finished
      ? "Replay tour"
      : "Site voice tour, click to hear what this site is about";

  return (
    <button
      type="button"
      className={`voice-tour-button ${speaking ? "is-speaking" : ""}`}
      onClick={handleClick}
      aria-label={label}
    >
      {muted ? <VolumeX size={25} aria-hidden="true" /> : <Volume2 size={25} aria-hidden="true" />}
      <span className="floating-tooltip">{finished ? "Replay tour" : "Hear what this site is about"}</span>
    </button>
  );
}
