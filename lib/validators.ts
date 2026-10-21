import { z } from "zod";

const serviceIds = ["dog-walking", "home-sitting", "boarding", "doggy-day-care", "pet-taxi", "grooming-referral"] as const;

export const bookingSchema = z.object({
  service: z.enum(serviceIds),
  sitterUsername: z.string().min(2),
  startDate: z.string().min(8),
  endDate: z.string().min(8),
  startTime: z.string().min(3),
  endTime: z.string().min(3),
  petSpecies: z.string().min(2),
  petName: z.string().min(1).max(80),
  petAge: z.string().min(1).max(30),
  petBreed: z.string().min(1).max(80),
  specialNeeds: z.string().max(1000).optional().default(""),
  vetContact: z.string().min(4).max(200),
  ownerName: z.string().min(2).max(100),
  ownerEmail: z.string().email(),
  ownerPhone: z.string().min(8).max(30),
  address: z.string().max(250).optional().default(""),
  recaptchaToken: z.string().min(1),
  recaptchaV2Token: z.string().optional()
});

export const reviewSchema = z.object({
  bookingReference: z.string().min(3),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(4).max(1000),
  recaptchaToken: z.string().min(1),
  recaptchaV2Token: z.string().optional()
});

export const sitterApplicationSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(8).max(30),
  email: z.string().email(),
  neighbourhood: z.string().min(2).max(80),
  services: z.array(z.string()).min(1),
  petTypes: z.array(z.string()).min(1),
  experienceYears: z.coerce.number().int().min(0).max(60),
  certifications: z.string().max(1000).optional().default(""),
  bio: z.string().min(30).max(1800),
  backgroundCheck: z.literal(true),
  recaptchaToken: z.string().min(1),
  recaptchaV2Token: z.string().optional()
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(8).max(2000),
  recaptchaToken: z.string().min(1),
  recaptchaV2Token: z.string().optional()
});
