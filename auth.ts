import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";

const credentialSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  role: z.enum(["owner", "sitter"]).default("owner"),
  name: z.string().optional(),
  recaptchaToken: z.string().min(1),
  recaptchaV2Token: z.string().optional(),
  recaptchaAction: z.enum(["auth_signin", "auth_signup"]).optional()
});

const providers = [
  Credentials({
    name: "Email and password",
    credentials: {
      name: { label: "Name", type: "text" },
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      role: { label: "Role", type: "text" },
      recaptchaToken: { label: "reCAPTCHA token", type: "text" },
      recaptchaV2Token: { label: "reCAPTCHA v2 token", type: "text" },
      recaptchaAction: { label: "reCAPTCHA action", type: "text" }
    },
    async authorize(credentials) {
      const parsed = credentialSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const { email, role, name, recaptchaToken, recaptchaV2Token, recaptchaAction } = parsed.data;
      const captcha = await verifyRecaptcha(recaptchaToken, recaptchaAction, recaptchaV2Token);
      if (!captcha.ok) return null;

      return {
        id: `leah-paws-${Buffer.from(email).toString("base64url")}`,
        name: name?.trim() || email.split("@")[0],
        email,
        role
      };
    }
  }),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
      ]
    : [])
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  trustHost: true,
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.role) token.role = user.role;
      if (trigger === "update" && session?.role) token.role = session.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role === "sitter" ? "sitter" : "owner";
      return session;
    }
  }
});
