import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { serialize } from "cookie";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { error: "Email tidak ditemukan" },
        { status: 401 },
      );

    const isValid = await verifyPassword(password, user.password);
    if (!isValid)
      return NextResponse.json({ error: "Password salah" }, { status: 401 });

    // ✅ Buat token JWT
    const token = await new SignJWT({ id: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    // ✅ Set cookie yang bisa dibaca SSR
    const cookie = serialize("pos_session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
      sameSite: "lax",      // ← penting agar bisa terbaca
      secure: process.env.NODE_ENV === "production", // ← true jika HTTPS
    });

    return NextResponse.json(
      { success: true, role: user.role },
      {
        headers: {
          "Set-Cookie": cookie,
        },
      },
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
