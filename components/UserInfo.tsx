"use client";

import { useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    role: "ADMIN" | "KASIR";
};

export default function UserInfo() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                if (!res.ok) throw new Error("Gagal mendapatkan data user");
                const data = await res.json();
                setUser(data.user);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Terjadi kesalahan");
                }
                setUser(null);

            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    if (loading) return <p>Memuat user...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!user) return <p>Silakan login</p>;

    return (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
            </div>
        </div>
    );
}
