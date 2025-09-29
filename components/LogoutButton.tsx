"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        try {
            // Panggil API logout (buat endpoint /api/auth/logout)
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            // Redirect ke halaman login setelah logout
            router.push("/login");
        } catch (error) {
            console.error("Logout gagal:", error);
            alert("Logout gagal, coba lagi.");
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
            Logout
        </button>
    );
}
