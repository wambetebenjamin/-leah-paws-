import { NextRequest, NextResponse } from "next/server";
import { sitters } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const service = searchParams.get("service")?.toLowerCase();
  const petType = searchParams.get("petType") ?? searchParams.get("pet_type");
  const neighbourhood = searchParams.get("neighbourhood")?.toLowerCase();
  const price = searchParams.get("price");
  const rating = Number(searchParams.get("rating") ?? 0);
  const date = searchParams.get("date");

  let results = sitters.filter((sitter) => {
    if (service && !sitter.services.includes(service as (typeof sitter.services)[number])) return false;
    if (petType && !sitter.petTypes.includes(petType as (typeof sitter.petTypes)[number])) return false;
    if (neighbourhood && !sitter.location.toLowerCase().includes(neighbourhood)) return false;
    if (rating && sitter.rating < rating) return false;
    if (date && !sitter.availability.includes(date)) return false;
    return true;
  });

  if (price) {
    const [min, max] = price.split("-").map(Number);
    results = results.filter((sitter) => {
      if (Number.isFinite(min) && sitter.price < min) return false;
      if (Number.isFinite(max) && sitter.price > max) return false;
      return true;
    });
  }

  return NextResponse.json({ sitters: results, count: results.length });
}
