"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { requireAdmin } from "../../../lib/auth-roles";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function createUserAction(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as "ADMIN" | "KASIR") || "KASIR";

  if (!name || !email || !password) {
    return { error: "Semua field wajib diisi" };
  }

  try {
    const hashed = await hashPassword(password);
    await prisma.user.create({
      data: { name, email, password: hashed, role },
    });
    return { success: "User berhasil dibuat" };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: "Gagal membuat user: " + err.message };
    }
    return { error: "Gagal membuat user" };
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies(); // remove await here
  const token = cookieStore.get("pos_session")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: "ADMIN" | "KASIR";
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, role: true },
    });
    return user;
  } catch {
    return null;
  }
}
