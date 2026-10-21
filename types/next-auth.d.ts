import "next-auth";

declare module "next-auth" {
  interface User {
    role?: "owner" | "sitter";
  }

  interface Session {
    user: {
      id?: string;
      role?: "owner" | "sitter";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "owner" | "sitter";
  }
}
