import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyPassword } from "../../../../lib/auth";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 401 });

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Password salah" }, { status: 401 });

    const cookie = serialize("pos_session", JSON.stringify({ id: user.id, role: user.role }), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 hari
    });

    return NextResponse.json({ success: true, role: user.role }, { headers: { "Set-Cookie": cookie } });
}
