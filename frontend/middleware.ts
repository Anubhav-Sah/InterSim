import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  const { pathname } = req.nextUrl;

  // Public routes (no auth required)
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  // If not logged in and trying to access protected route → redirect
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/task/:path*",
    "/editor/:path*",
    "/feedback/:path*",
    "/profile",
    "/onboarding",
  ],
};
