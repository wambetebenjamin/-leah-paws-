"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; theme?: "light" | "dark" }) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

function siteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
}

function loadV3(key: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.grecaptcha?.execute) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[data-recaptcha-v3="${key}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load reCAPTCHA")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaV3 = key;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load reCAPTCHA"));
    document.head.appendChild(script);
  });
}

export async function getRecaptchaToken(action: string) {
  const key = siteKey();
  if (!key) return "local-development-token";
  await loadV3(key);
  return new Promise<string>((resolve, reject) => {
    window.grecaptcha?.ready(() => {
      window.grecaptcha?.execute(key, { action }).then(resolve).catch(reject);
    });
  });
}

export function RecaptchaV2Fallback({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<number | undefined>(undefined);
  const id = useId();
  const key = siteKey();

  useEffect(() => {
    if (!key || !containerRef.current) return;
    const render = () => {
      if (!containerRef.current || widgetRef.current !== undefined || !window.grecaptcha?.render) return;
      widgetRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: key,
        callback: onVerify,
        theme: "light"
      });
    };

    if (window.grecaptcha?.render) {
      render();
      return;
    }

    const scriptId = "leah-paws-recaptcha-v2";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    return () => script?.removeEventListener("load", render);
  }, [key, onVerify]);

  if (!key) return <p className="form-note">Development mode verification is enabled. Add a reCAPTCHA site key before going live.</p>;
  return <div className="recaptcha-fallback"><p id={id}>Please complete this extra verification before submitting again.</p><div ref={containerRef} aria-describedby={id} /></div>;
}
