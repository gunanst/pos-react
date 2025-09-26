// lib/auth-roles.ts
import { getCurrentUser } from "@/app/actions/users/actions";
export type UserRole = "ADMIN" | "KASIR";

export const ROLES = {
  ADMIN: "ADMIN" as UserRole,
  KASIR: "KASIR" as UserRole,
};

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Harus login terlebih dahulu");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Akses ditolak: hanya admin yang boleh");
  }

  return user;
}

export async function requireKasir() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Harus login terlebih dahulu");
  }

  if (user.role !== "KASIR") {
    throw new Error("Akses ditolak: hanya kasir yang boleh");
  }

  return user;
}
