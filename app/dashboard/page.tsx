import DashboardCard from "../../components/dashboard/ui/DashboardCard";
import SalesBarChart from "../../components/dashboard/ui/SalesChart";
import { getDashboardData, getCurrentUser } from "../actions/dashboard/actions"; // ambil user & data dashboard
import Checkout from "../../components/dashboard/sales/ui/Checkout";

export default async function DashboardPage() {
  // Ambil data dashboard
  const { totalProducts, totalOmzet, totalQtySold, salesPerHour } =
    await getDashboardData();

  // Ambil user login (kasir/admin)
  const user = await getCurrentUser(); // { id, name, role } atau null

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Produk"
          value={totalProducts}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Omzet Hari Ini"
          value={`Rp${totalOmzet.toLocaleString()}`}
          color="bg-green-100"
        />
        <DashboardCard
          title="Produk Terjual"
          value={totalQtySold}
          color="bg-yellow-100"
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Penjualan per Jam</h2>
        <SalesBarChart data={salesPerHour} />
      </div>

      {/* Checkout Section */}
      <Checkout products={[]} user={user} />
    </div>
  );
}
