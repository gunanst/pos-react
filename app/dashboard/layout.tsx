"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  role: "ADMIN" | "KASIR";
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include", // **Jangan lupa ini!**
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 text-xl font-bold border-b">POS Starterkit</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard" ? "bg-gray-300" : ""
              }`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/products"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/products" ? "bg-gray-300" : ""
              }`}
          >
            Produk
          </Link>
          <Link
            href="/dashboard/sales"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/sales" ? "bg-gray-300" : ""
              }`}
          >
            Sales
          </Link>
          <Link
            href="/dashboard/sales/history"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/sales/history" ? "bg-gray-300" : ""
              }`}
          >
            Riwayat
          </Link>
          <Link
            href="/dashboard/users"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/users" ? "bg-gray-300" : ""
              }`}
          >
            Users
          </Link>
        </nav>
        <div className="p-6 border-t text-sm text-gray-500">v1.0.0</div>
      </aside>

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="p-6 bg-white shadow flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {loading
                ? "Memuat..."
                : user
                  ? `User: ${user.name} (${user.role})`
                  : "Tidak ada user"}
            </span>
            <LogoutButton />
          </div>
        </header>

        <main className="p-6 flex-1">{children}</main>

        <footer className="p-4 bg-white shadow text-center text-sm text-gray-500">
          POS Starterkit &copy; 2025
        </footer>
      </div>
    </div>
  );
}
