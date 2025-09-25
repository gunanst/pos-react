import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // izinkan akses login dan api
    if (path.startsWith("/login") || path.startsWith("/api")) return NextResponse.next();

    const cookie = req.cookies.get("pos_session")?.value;
    if (!cookie) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/sales/:path*", "/products/:path*"], // route yg perlu proteksi
};
