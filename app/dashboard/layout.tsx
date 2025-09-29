// /app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, Users, LogOut, History } from "lucide-react";

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

  // State user, loading, sidebar open, dan error
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk fetch data user dari API
  async function fetchUser() {
    try {
      setError(null);      // Reset error
      setLoading(true);    // Set loading true selama fetch
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat data user");
      const data = await res.json();
      setUser(data.user);  // Simpan data user ke state
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan");
      }
      setUser(null);
    } finally {
      setLoading(false); // Set loading false setelah selesai
    }
  }

  // Jalankan fetchUser saat komponen pertama kali mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay hitam saat sidebar terbuka di mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col z-50 transform md:transform-none transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        {/* Header sidebar */}
        <div className="p-6 text-xl font-bold border-b flex justify-between items-center">
          POS GUNAWAN
          {/* Tombol tutup sidebar di mobile */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            &#x2715;
          </button>
        </div>

        {/* Navigasi sidebar dengan ikon dan link */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/products"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/products" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Package size={18} />
            Produk
          </Link>

          <Link
            href="/dashboard/sales"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/sales" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            <LogOut size={18} />
            Sales
          </Link>

          <Link
            href="/dashboard/sales/history"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/sales/history" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            <History size={18} />
            Riwayat
          </Link>

          <Link
            href="/dashboard/users"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/users" ? "bg-gray-300" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Users size={18} />
            Users
          </Link>
        </nav>

        {/* Versi aplikasi di bawah sidebar */}
        <div className="p-6 border-t text-sm text-gray-500">v1.0.0</div>
      </aside>

      {/* Konten utama dashboard */}
      <div className="flex-1 flex flex-col overflow-auto md:ml-64">
        {/* Header atas */}
        <header className="p-6 bg-white shadow flex justify-between items-center sticky top-0 z-30">
          {/* Tombol hamburger di mobile untuk buka sidebar */}
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

          {/* Sapaan selamat datang dan nama user */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
              Selamat Datang,
            </h1>
            <p className="text-sm text-gray-600">
              {loading ? "Memuat..." : user ? user.name : "Tamu"}
            </p>

            {/* Tampilkan error fetch user jika ada */}
            {error && (
              <p className="text-red-500 text-xs mt-1">
                {error}{" "}
                <button
                  onClick={fetchUser}
                  className="underline hover:text-red-700"
                >
                  Coba lagi
                </button>
              </p>
            )}
          </div>

          {/* Info user dan tombol logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                {/* Avatar dengan huruf pertama nama user */}
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold uppercase">
                  {user.name.charAt(0)}
                </div>

                {/* Nama dan role user */}
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
              </div>
            )}
            {/* Komponen tombol logout */}
            <LogoutButton />
          </div>
        </header>

        {/* Konten utama yang berubah sesuai route */}
        <main className="p-6 flex-1">{children}</main>

        {/* Footer bawah */}
        <footer className="p-4 bg-white shadow text-center text-sm text-gray-500">
          GUNAWAN &copy; 2025
        </footer>
      </div>
    </div>
  );
}
