import { auth } from "@/auth";

export async function requireRole(role: "owner" | "sitter") {
  const session = await auth();
  if (!session?.user || session.user.role !== role) return null;
  return session;
}
