// app/api/auth/me/route.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("pos_session")?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );

        const user = await prisma.user.findUnique({
            where: { id: payload.id as number },
            select: { id: true, name: true, role: true },
        });

        if (!user) {
            return NextResponse.json({ user: null }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("JWT verify error:", error);
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
