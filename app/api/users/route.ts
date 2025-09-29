import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

type UpdateUserData = {
  password?: string;
  isActive?: boolean;
  name?: string;
  email?: string;
  role?: Role;
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = Number(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const data = await req.json();

  const updateData: UpdateUserData = {};

  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }
  if (typeof data.isActive === "boolean") {
    updateData.isActive = data.isActive;
  }
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;

  // Cek dan konversi role ke enum Role
  if (data.role && Object.values(Role).includes(data.role)) {
    updateData.role = data.role as Role;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return NextResponse.json(updatedUser);
  } catch {
    return NextResponse.json(
      { error: "User not found or update failed" },
      { status: 404 }
    );
  }
}
