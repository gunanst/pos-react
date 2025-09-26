import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Middleware untuk proteksi route
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Izinkan akses login & API tanpa token
  if (pathname.startsWith("/login") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Ambil token dari cookie
  const token = req.cookies.get("pos_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify JWT pakai jose
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!),
    );

    // Role-based access
    // Kasir hanya boleh akses /sales
    if (payload.role === "KASIR" && !pathname.startsWith("/sales")) {
      return NextResponse.redirect(new URL("/sales", req.url));
    }

    // Admin bisa akses semua (tidak ada redirect)
  } catch {
    // Token invalid atau expired → redirect login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Route yang perlu proteksi
export const config = {
  matcher: ["/dashboard/:path*", "/sales/:path*", "/products/:path*"],
};
