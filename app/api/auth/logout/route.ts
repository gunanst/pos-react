// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ message: "Logged out" });

    // Hapus cookie "pos_session"
    res.cookies.set("pos_session", "", {
        path: "/",
        expires: new Date(0),
    });

    return res;
}
