import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sitterApplicationSchema } from "@/lib/validators";

function arrayField(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const candidate = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    neighbourhood: String(formData.get("neighbourhood") ?? ""),
    services: arrayField(formData.get("services")),
    petTypes: arrayField(formData.get("petTypes")),
    experienceYears: formData.get("experienceYears"),
    certifications: String(formData.get("certifications") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    backgroundCheck: formData.get("backgroundCheck") === "true",
    recaptchaToken: String(formData.get("recaptchaToken") ?? ""),
    recaptchaV2Token: String(formData.get("recaptchaV2Token") ?? "") || undefined
  };

  const parsed = sitterApplicationSchema.safeParse(candidate);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete every required application field", issues: parsed.error.flatten() }, { status: 400 });
  }

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, "sitter_apply", parsed.data.recaptchaV2Token);
  if (!captcha.ok) {
    return NextResponse.json(
      { error: captcha.reason ?? "Could not verify that request", requiresV2: captcha.requiresV2 },
      { status: captcha.requiresV2 ? 422 : 400 }
    );
  }

  const certificationFile = formData.get("certificationFile");
  let certificationUrl = "";
  if (certificationFile instanceof File && certificationFile.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`sitter-certifications/${Date.now()}-${certificationFile.name}`, certificationFile, {
      access: "public",
      addRandomSuffix: true
    });
    certificationUrl = blob.url;
  }

  const adminEmail = process.env.SMTP_USER || process.env.SMTP_FROM;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New Leah Paws sitter application: ${parsed.data.name}`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone}\nNeighbourhood: ${parsed.data.neighbourhood}\nServices: ${parsed.data.services.join(", ")}\nPet types: ${parsed.data.petTypes.join(", ")}\nExperience: ${parsed.data.experienceYears} years\nBio: ${parsed.data.bio}\nCertificate: ${certificationUrl || "Not uploaded"}`
    });
  }

  await sendEmail({
    to: parsed.data.email,
    subject: "We received your Leah Paws sitter application",
    text: `Hi ${parsed.data.name},\n\nThank you for applying to care for pets with Leah Paws. Our team will review your background check consent and application, then get in touch soon.`
  });

  return NextResponse.json({ ok: true, certificationUrl }, { status: 201 });
}
