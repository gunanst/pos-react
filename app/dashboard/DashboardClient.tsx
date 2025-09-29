"use client";

import { useEffect, useState } from "react";

export default function DashboardClient() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error("Error:", err);
            }
        }

        fetchUser();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
                <p>Halo, {user.name}</p>
            ) : (
                <p>Memuat user atau belum login...</p>
            )}
        </div>
    );
}
