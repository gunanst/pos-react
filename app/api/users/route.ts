// app/api/users/route.ts
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "KASIR", // default kasir
    },
  });

  return NextResponse.json(user);
}
