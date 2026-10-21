import { kv } from "@vercel/kv";
import type { BookingRecord, CareUpdate } from "@/lib/types";

const globalStore = globalThis as unknown as {
  leahPawsBookings?: Map<string, BookingRecord>;
  leahPawsCareUpdates?: Map<string, CareUpdate[]>;
};

const bookings = globalStore.leahPawsBookings ?? new Map<string, BookingRecord>();
const careUpdates = globalStore.leahPawsCareUpdates ?? new Map<string, CareUpdate[]>();
globalStore.leahPawsBookings = bookings;
globalStore.leahPawsCareUpdates = careUpdates;

function hasKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function saveBooking(booking: BookingRecord) {
  bookings.set(booking.reference, booking);
  if (hasKv()) await kv.set(`booking:${booking.reference}`, booking);
  return booking;
}

export async function getBooking(reference: string) {
  if (hasKv()) {
    const stored = await kv.get<BookingRecord>(`booking:${reference}`);
    if (stored) return stored;
  }
  return bookings.get(reference) ?? null;
}

export async function saveCareUpdate(update: CareUpdate) {
  const current = careUpdates.get(update.bookingReference) ?? [];
  const next = [update, ...current];
  careUpdates.set(update.bookingReference, next);
  if (hasKv()) await kv.set(`care-updates:${update.bookingReference}`, next);
  return update;
}

export async function getCareUpdates(reference: string) {
  if (hasKv()) {
    const stored = await kv.get<CareUpdate[]>(`care-updates:${reference}`);
    if (stored) return stored;
  }
  return careUpdates.get(reference) ?? [];
}
