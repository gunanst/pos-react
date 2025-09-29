import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

interface Params {
    params: { id: string };
}

type UpdateUserData = {
    password?: string;
    isActive?: boolean;
    name?: string;
    role?: Role;
};

export async function PUT(req: Request, { params }: Params) {
    const userId = Number(params.id);
    if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { password, isActive, name, role } = await req.json();

    const data: UpdateUserData = {};

    if (password) {
        data.password = await hashPassword(password);
    }
    if (typeof isActive === "boolean") {
        data.isActive = isActive;
    }
    if (name) data.name = name;

    // Validasi dan cast role ke enum Role
    if (role && Object.values(Role).includes(role)) {
        data.role = role as Role;
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
        });
        return NextResponse.json(updatedUser);
    } catch {
        return NextResponse.json(
            { error: "User not found or update failed" },
            { status: 404 }
        );
    }
}
