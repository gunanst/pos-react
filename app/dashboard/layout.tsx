"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg flex flex-col">
                <div className="p-6 text-xl font-bold border-b">POS Starterkit</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/dashboard"
                        className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard" ? "bg-gray-300" : ""}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/products"
                        className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/products" ? "bg-gray-300" : ""}`}
                    >
                        Produk
                    </Link>

                    <Link
                        href="/dashboard/sales"
                        className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/sales" ? "bg-gray-300" : ""}`}
                    >
                        Sales
                    </Link>
                    <Link
                        href="/dashboard/sales/history"
                        className={`block p-2 rounded hover:bg-gray-200 ${pathname === "/dashboard/sales/history" ? "bg-gray-300" : ""}`}
                    >
                        Riwayat
                    </Link>
                </nav>
                <div className="p-6 border-t text-sm text-gray-500">v1.0.0</div>
            </aside>

            <div className="flex-1 flex flex-col overflow-auto">
                <header className="p-6 bg-white shadow flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div>User: Admin</div>
                </header>

                <main className="p-6 flex-1">{children}</main>

                <footer className="p-4 bg-white shadow text-center text-sm text-gray-500">
                    POS Starterkit &copy; 2025
                </footer>
            </div>
        </div>
    );
}
