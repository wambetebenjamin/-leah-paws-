import { NextResponse } from "next/server";
import { getSitter } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const sitter = getSitter(username);

  if (!sitter) return NextResponse.json({ error: "Sitter not found" }, { status: 404 });
  return NextResponse.json({ sitter });
}
