import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { strapiToken: string; role: string; mustResetPassword: boolean; description: string } & DefaultSession["user"];
  }
  interface User {
    role?: string;
    strapiToken?: string;
    mustResetPassword?: boolean;
    description?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    strapiToken?: string;
    role?: string;
    mustResetPassword?: boolean;
    description?: string;
  }
}
