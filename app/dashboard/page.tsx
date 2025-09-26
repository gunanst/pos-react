import DashboardCard from "../../components/dashboard/ui/DashboardCard";
import SalesBarChart from "../../components/dashboard/ui/SalesChart";
import { getDashboardData, getCurrentUser } from "../actions/dashboard/actions";
import Checkout from "../../components/dashboard/sales/ui/Checkout";

export default async function DashboardPage() {
  const { totalProducts, totalOmzet, totalQtySold, salesPerHour } =
    await getDashboardData();

  const user = await getCurrentUser();

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 py-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Produk"
          value={totalProducts}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Omzet Hari Ini"
          value={`Rp${totalOmzet.toLocaleString("id-ID")}`}
          color="bg-green-100"
        />
        <DashboardCard
          title="Produk Terjual"
          value={totalQtySold}
          color="bg-yellow-100"
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Penjualan per Jam
        </h2>
        <SalesBarChart data={salesPerHour} />
      </div>

      {/* Checkout Section */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Transaksi</h2>
        <Checkout products={[]} user={user} />
      </div>
    </div>
  );
}
