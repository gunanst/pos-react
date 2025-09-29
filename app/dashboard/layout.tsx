"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  Users,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  role: "ADMIN" | "KASIR";
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Produk",
    href: "/dashboard/products",
    icon: <Package size={18} />,
  },
  {
    label: "Sales",
    href: "/dashboard/sales",
    icon: <ShoppingCart size={18} />,
  },
  {
    label: "Riwayat",
    href: "/dashboard/sales/history",
    icon: <History size={18} />,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: <Users size={18} />,
  },
];

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
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay untuk mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
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
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            &#x2715;
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-2 rounded-md font-medium text-sm transition-colors ${pathname === href
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => setSidebarOpen(false)}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t text-xs text-gray-500">v1.0.0</div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto md:ml-64">
        <header className="p-6 bg-white shadow flex justify-between items-center sticky top-0 z-30">
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

          <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
            Selamat Datang
          </h1>
          <div className="flex items-center gap-3">
            {loading ? (
              <span className="text-sm text-gray-500">Memuat user...</span>
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
              </div>
            ) : (
              <span className="text-sm text-red-500">Tidak ada user</span>
            )}
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
