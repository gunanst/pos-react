// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Middleware untuk proteksi route dan role-based akses
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Daftar path publik yang boleh diakses tanpa token
  const publicPaths = [
    "/login",
    "/api",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/uploads"
  ];

  // Cek apakah path termasuk publik
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next(); // Langsung lanjutkan request

  // Ambil token dari cookie
  const token = req.cookies.get("pos_session")?.value;
  if (!token) {
    // Jika tidak ada token, redirect ke login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verifikasi token dengan secret JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const role = payload.role as string;

    // Jika role KASIR dan mencoba akses selain /dashboard/sales, redirect ke halaman akses ditolak
    if (role === "KASIR" && !pathname.startsWith("/dashboard/sales")) {
      return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    // Jika lolos pengecekan, lanjutkan request
    return NextResponse.next();
  } catch {
    // Jika token tidak valid, redirect ke login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Konfigurasi middleware untuk semua route kecuali yang dikecualikan
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|robots.txt|sitemap.xml|uploads).*)"
  ],
};
