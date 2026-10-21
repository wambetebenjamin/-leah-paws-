"use client";

import { Check, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Preferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

const key = "leah_paws_consent";
const initialPreferences: Preferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      setShowBanner(true);
      return;
    }
    try {
      setPreferences({ ...initialPreferences, ...JSON.parse(stored) });
    } catch {
      setShowBanner(true);
    }
  }, []);

  const save = (next: Preferences) => {
    window.localStorage.setItem(key, JSON.stringify(next));
    setPreferences(next);
    setShowBanner(false);
    setShowModal(false);
  };

  return (
    <>
      {showBanner && (
        <section className="cookie-banner" aria-label="Cookie consent">
          <div>
            <p className="eyebrow">Your privacy matters</p>
            <h2>Cookies that keep Leah Paws caring and useful</h2>
            <p>
              We use necessary cookies for safe booking. You can choose optional cookies for a more useful
              experience, in line with Kenya&apos;s Data Protection Act, 2019.
            </p>
          </div>
          <div className="cookie-actions">
            <button className="button button-outline" type="button" onClick={() => setShowModal(true)}>
              <Settings2 size={16} aria-hidden="true" /> Manage preferences
            </button>
            <button
              className="button button-primary"
              type="button"
              onClick={() => save({ necessary: true, functional: true, analytics: true, marketing: true })}
            >
              <Check size={16} aria-hidden="true" /> Accept all
            </button>
          </div>
        </section>
      )}

      {showModal && (
        <div className="consent-modal-backdrop" role="presentation">
          <section className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
            <button className="modal-close" type="button" aria-label="Close cookie preferences" onClick={() => setShowModal(false)}>
              <X size={20} aria-hidden="true" />
            </button>
            <p className="eyebrow">Cookie preferences</p>
            <h2 id="cookie-title">Choose how Leah Paws uses cookies</h2>
            <p>Necessary cookies stay on because secure account and booking features need them.</p>
            <div className="preference-list">
              <PreferenceRow label="Necessary" description="Safe booking, security and essential site functions." checked locked />
              <PreferenceRow
                label="Functional"
                description="Remember helpful choices, such as your preferred booking details."
                checked={preferences.functional}
                onChange={(functional) => setPreferences((current) => ({ ...current, functional }))}
              />
              <PreferenceRow
                label="Analytics"
                description="Help us understand which care pages are useful."
                checked={preferences.analytics}
                onChange={(analytics) => setPreferences((current) => ({ ...current, analytics }))}
              />
              <PreferenceRow
                label="Marketing"
                description="Let us share relevant Leah Paws updates with your permission."
                checked={preferences.marketing}
                onChange={(marketing) => setPreferences((current) => ({ ...current, marketing }))}
              />
            </div>
            <button className="button button-primary full-button" type="button" onClick={() => save(preferences)}>
              Save preferences
            </button>
          </section>
        </div>
      )}
    </>
  );
}

function PreferenceRow({
  label,
  description,
  checked,
  locked = false,
  onChange
}: {
  label: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="preference-row">
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <input type="checkbox" checked={checked} disabled={locked} onChange={(event) => onChange?.(event.target.checked)} />
      <span className="toggle-track" aria-hidden="true"><span /></span>
    </label>
  );
}
