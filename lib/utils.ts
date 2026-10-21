export function formatKes(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(amount);
}

export function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function bookingReference() {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `LP-${suffix}`;
}

export function whatsappUrl(message: string) {
  return `https://wa.me/254112272061?text=${encodeURIComponent(message)}`;
}
