import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Middleware untuk proteksi route
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Izinkan akses ke halaman publik (login, API, static files)
  const publicPaths = [
    "/login",
    "/api",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/uploads"
  ];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  // ✅ Ambil token dari cookie
  const token = req.cookies.get("pos_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // ✅ Verifikasi token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const role = payload.role as string;

    // ✅ Jika role KASIR tapi akses selain /sales, redirect
    if (role === "KASIR" && !pathname.startsWith("/sales")) {
      return NextResponse.redirect(new URL("/sales", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// ✅ Proteksi semua halaman utama, kecuali path publik
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|robots.txt|sitemap.xml|uploads).*)"
  ],
};
