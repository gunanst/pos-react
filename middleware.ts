import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Daftar path publik yang boleh diakses tanpa login
  const publicPaths = [
    "/login",
    "/api",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/uploads",
  ];

  // Jika path termasuk public, langsung lanjut
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Ambil token dari cookie
  const token = req.cookies.get("pos_session")?.value;
  if (!token) {
    // Redirect ke login kalau token tidak ada
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verifikasi token JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const role = payload.role as string;

    // Jika role KASIR, batasi akses hanya ke /dashboard/sales dan subpathnya
    if (role === "KASIR") {
      if (!pathname.startsWith("/dashboard/sales")) {
        return NextResponse.redirect(new URL("/dashboard/sales", req.url));
      }
    }

    // Jika ADMIN atau role lain, bebas akses
    return NextResponse.next();
  } catch (error) {
    // Jika error verifikasi token, redirect ke login
    console.error("Middleware JWT verify error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Konfigurasi middleware untuk proteksi semua route kecuali yang sudah didefinisikan di publicPaths
export const config = {
  matcher: [
    // Proteksi semua kecuali folder dan file statis, login, dan api publik
    "/((?!api|_next/static|_next/image|favicon.ico|login|robots.txt|sitemap.xml|uploads).*)",
  ],
};
