import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" });

    // Hapus cookie pos_session dengan mengatur expired date
    response.cookies.set({
        name: "pos_session",
        value: "",
        path: "/",
        expires: new Date(0), // expire segera
    });

    return response;
}
