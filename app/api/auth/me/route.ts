import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

// Endpoint untuk mendapatkan data user dari token di cookie
export async function GET(req: NextRequest) {
    // Ambil token dari cookie pos_session
    const token = req.cookies.get("pos_session")?.value;

    if (!token) {
        // Kalau token gak ada, return user null dengan status 401 Unauthorized
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        // Verifikasi JWT token dengan secret
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );

        // Cari user di database berdasarkan ID dari payload token
        const user = await prisma.user.findUnique({
            where: { id: payload.id as number },
            select: { id: true, name: true, role: true },
        });

        if (!user) {
            // Kalau user gak ditemukan, return 404
            return NextResponse.json({ user: null }, { status: 404 });
        }

        // Kalau berhasil, kirim data user
        return NextResponse.json({ user });
    } catch (error) {
        console.error("JWT verify error:", error);
        // Kalau token tidak valid, return 401 Unauthorized
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
