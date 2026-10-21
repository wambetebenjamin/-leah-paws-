import { NextRequest, NextResponse } from "next/server";
import { getSitter } from "@/lib/data";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  const month = request.nextUrl.searchParams.get("month");

  if (!username || !month) {
    return NextResponse.json({ error: "username and month are required" }, { status: 400 });
  }

  const sitter = getSitter(username);
  if (!sitter) return NextResponse.json({ error: "Sitter not found" }, { status: 404 });

  return NextResponse.json({
    username,
    month,
    availableDates: sitter.availability.filter((date) => date.startsWith(month)),
    unavailableDates: sitter.unavailableDates.filter((date) => date.startsWith(month))
  });
}
