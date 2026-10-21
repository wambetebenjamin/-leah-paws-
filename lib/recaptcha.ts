type VerificationResult = {
  ok: boolean;
  score?: number;
  requiresV2?: boolean;
  reason?: string;
};

export async function verifyRecaptcha(
  token: string,
  expectedAction?: string,
  v2Token?: string
): Promise<VerificationResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return process.env.NODE_ENV === "production"
      ? { ok: false, reason: "reCAPTCHA is not configured" }
      : { ok: true, score: 1 };
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: v2Token || token })
  });

  if (!response.ok) return { ok: false, reason: "Verification service is unavailable" };

  const result = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
    [key: string]: unknown;
  };

  if (!result.success) return { ok: false, reason: "Verification was not successful" };

  if (v2Token) return { ok: true, score: 1 };

  const score = result.score ?? 0;
  const actionMatches = !expectedAction || result.action === expectedAction;
  if (!actionMatches) return { ok: false, score, reason: "Verification action did not match" };
  if (score < 0.5) return { ok: false, score, requiresV2: true, reason: "A second verification is needed" };

  return { ok: true, score };
}
