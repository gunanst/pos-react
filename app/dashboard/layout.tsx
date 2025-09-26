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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
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
      {/* Sidebar untuk desktop dan mobile */}
      {/* Overlay untuk mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col z-50
          transform md:transform-none
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="p-6 text-xl font-bold border-b flex justify-between items-center">
          POS GUNAWAN
          {/* Tombol close sidebar di mobile */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            &#x2715;
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/products"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/products" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            Produk
          </Link>
          <Link
            href="/dashboard/sales"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/sales" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            Sales
          </Link>
          <Link
            href="/dashboard/sales/history"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/sales/history" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            Riwayat
          </Link>
          <Link
            href="/dashboard/users"
            className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/users" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            Users
          </Link>
        </nav>
        <div className="p-6 border-t text-sm text-gray-500">v1.0.0</div>
      </aside>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col overflow-auto md:ml-64">
        <header className="p-6 bg-white shadow flex justify-between items-center sticky top-0 z-30">
          {/* Tombol hamburger hanya muncul di mobile */}
          <button
            className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

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
          GUNAWAN &copy; 2025
        </footer>
      </div>
    </div>
  );
}
