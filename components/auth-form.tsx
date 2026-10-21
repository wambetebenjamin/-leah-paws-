"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { CheckCircle2, Chrome, PawPrint } from "lucide-react";
import { FormEvent, useState } from "react";
import { RecaptchaV2Fallback, getRecaptchaToken } from "@/components/recaptcha";

type AuthMode = "signin" | "signup";
type Role = "owner" | "sitter";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [role, setRole] = useState<Role>("owner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");

  const verify = async (action: string) => {
    const token = await getRecaptchaToken(action);
    const response = await fetch("/api/recaptcha/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action, v2Token: v2Token || undefined })
    });
    const result = await response.json();
    if (!response.ok) {
      if (result.requiresV2) setNeedsV2(true);
      throw new Error(result.reason || result.error || "We could not verify this request.");
    }
    return token;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const recaptchaAction = mode === "signup" ? "auth_signup" : "auth_signin";
      const recaptchaToken = await verify(recaptchaAction);
      const result = await signIn("credentials", {
        email,
        password,
        name,
        role,
        recaptchaToken,
        recaptchaV2Token: v2Token || undefined,
        recaptchaAction,
        redirect: false,
        callbackUrl: role === "sitter" ? "/sitter/dashboard" : "/my-bookings"
      });
      if (result?.error) throw new Error("We could not sign you in with those details.");
      window.location.assign(result?.url || (role === "sitter" ? "/sitter/dashboard" : "/my-bookings"));
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "We could not complete that request.");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    setMessage("");
    try {
      await verify("auth_google");
      await signIn("google", { callbackUrl: role === "sitter" ? "/sitter/dashboard" : "/my-bookings" });
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Google sign in is unavailable right now.");
      setLoading(false);
    }
  };

  const title = mode === "signup" ? "Create your Leah Paws account" : "Welcome back";
  const intro = mode === "signup" ? "Start booking thoughtful pet care in Nairobi today." : "Sign in to follow every happy pet care moment.";

  return (
    <div className="auth-card">
      <p className="eyebrow">{mode === "signup" ? "Join the community" : "Your account"}</p>
      <h1>{title}</h1>
      <p>{intro}</p>
      <div className="auth-choice-grid" aria-label="Choose account type">
        <button className={`auth-choice ${role === "owner" ? "selected" : ""}`} type="button" onClick={() => setRole("owner")}><PawPrint size={21} aria-hidden="true" /><strong>I am a Pet Owner</strong><small>Book trusted care for my pet.</small></button>
        <button className={`auth-choice ${role === "sitter" ? "selected" : ""}`} type="button" onClick={() => setRole("sitter")}><CheckCircle2 size={21} aria-hidden="true" /><strong>I am a Pet Sitter</strong><small>Care for pets with Leah Paws.</small></button>
      </div>
      <form onSubmit={submit}>
        {mode === "signup" && <div className="form-field"><label htmlFor="auth-name">Your name</label><input id="auth-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required /></div>}
        <div className="form-field"><label htmlFor="auth-email">Email address</label><input id="auth-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
        <div className="form-field"><label htmlFor="auth-password">Password</label><input id="auth-password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={4} value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
        {needsV2 && <RecaptchaV2Fallback onVerify={(token) => { setV2Token(token); setMessage(""); }} />}
        <button className="button button-primary full-button" type="submit" disabled={loading || (needsV2 && !v2Token)}>{loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}</button>
      </form>
      <div className="auth-separator">or</div>
      <button className="button button-outline full-button" type="button" onClick={google} disabled={loading}><Chrome size={16} aria-hidden="true" /> Continue with Google</button>
      {message && <p className="form-error" role="alert">{message}</p>}
      <p className="auth-switch">{mode === "signup" ? "Already have an account?" : "New to Leah Paws?"} <Link href={mode === "signup" ? "/auth/signin" : "/auth/signup"}>{mode === "signup" ? "Sign in" : "Create an account"}</Link></p>
    </div>
  );
}
