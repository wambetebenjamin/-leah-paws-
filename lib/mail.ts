import nodemailer from "nodemailer";

type MailInput = {
  to: string;
  subject: string;
  text: string;
};

function configured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );
}

export async function sendEmail({ to, subject, text }: MailInput) {
  if (!configured()) {
    console.info("Email not sent because SMTP is not configured", { to, subject });
    return { delivered: false };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text
  });

  return { delivered: true };
}
