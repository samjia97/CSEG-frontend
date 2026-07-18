import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ALLOWED_WHILE_RESETTING = ["/reset-password", "/login", "/api"];
const PROTECTED_PREFIXES = ["/blog", "/forum", "/account"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Force a logged-in user with a temporary password (new user) through the reset flow.
  if (req.auth?.user?.mustResetPassword) {
    if (
      !ALLOWED_WHILE_RESETTING.some((p) => pathname.startsWith(p)) &&
      !pathname.startsWith("/_next")
    ) {
      return NextResponse.redirect(new URL("/reset-password", req.nextUrl));
    }
    return;
  }

  // If guest visiting the section for user only, redirect them to login page.
  if (!req.auth && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export const runtime = "nodejs";
