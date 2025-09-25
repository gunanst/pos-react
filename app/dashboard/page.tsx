import { getDashboardData } from "./actions";
import DashboardCard from "./ui/DashboardCard";
import SalesBarChart from "./ui/SalesChart";

export default async function DashboardPage() {
    const { totalProducts, totalOmzet, totalQtySold, latestSales, salesPerHour } =
        await getDashboardData();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg flex flex-col">
                <div className="p-6 text-xl font-bold border-b">POS Starterkit</div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="block p-2 rounded hover:bg-gray-200">Dashboard</a>
                    <a href="#" className="block p-2 rounded hover:bg-gray-200">Produk</a>
                    <a href="#" className="block p-2 rounded hover:bg-gray-200">Kasir</a>
                    <a href="#" className="block p-2 rounded hover:bg-gray-200">Laporan</a>
                </nav>
                <div className="p-6 border-t text-sm text-gray-500">v1.0.0</div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header */}
                <header className="p-6 bg-white shadow flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div>User: Admin</div>
                </header>

                {/* Content */}
                <main className="p-6 flex-1">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <DashboardCard title="Total Produk" value={totalProducts} color="bg-blue-100" />
                        <DashboardCard title="Omzet Hari Ini" value={`Rp${totalOmzet}`} color="bg-green-100" />
                        <DashboardCard title="Produk Terjual" value={totalQtySold} color="bg-yellow-100" />
                    </div>

                    {/* Bar Chart */}
                    <SalesBarChart data={salesPerHour} />

                    {/* Transaksi Terbaru */}
                    <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
                        <h2 className="font-semibold mb-2">Transaksi Terbaru</h2>
                        {latestSales.length === 0 ? (
                            <p>Belum ada transaksi</p>
                        ) : (
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2 text-left">ID</th>
                                        <th className="p-2 text-left">Tanggal</th>
                                        <th className="p-2 text-left">Total</th>
                                        <th className="p-2 text-left">Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestSales.map((sale) => {
                                        const total = sale.items.reduce(
                                            (sum, i) => sum + i.product.price * i.quantity,
                                            0
                                        );
                                        const totalItems = sale.items.reduce((sum, i) => sum + i.quantity, 0);
                                        return (
                                            <tr
                                                key={sale.id}
                                                className="hover:bg-gray-100 transition"
                                            >
                                                <td className="p-2">{sale.id}</td>
                                                <td className="p-2">{new Date(sale.createdAt).toLocaleString("id-ID")}</td>
                                                <td className="p-2">Rp{total}</td>
                                                <td className="p-2">{totalItems}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="p-4 bg-white shadow text-center text-sm text-gray-500">
                    POS Starterkit &copy; 2025
                </footer>
            </div>
        </div>
    );
}
