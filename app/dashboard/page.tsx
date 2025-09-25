import DashboardCard from "./ui/DashboardCard";
import SalesBarChart from "./ui/SalesChart";
import { getDashboardData } from "./actions";

export default async function DashboardPage() {
    const { totalProducts, totalOmzet, totalQtySold, salesPerHour } = await getDashboardData();

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <DashboardCard title="Total Produk" value={totalProducts} color="bg-blue-100" />
                <DashboardCard title="Omzet Hari Ini" value={`Rp${totalOmzet}`} color="bg-green-100" />
                <DashboardCard title="Produk Terjual" value={totalQtySold} color="bg-yellow-100" />
            </div>
            <SalesBarChart data={salesPerHour} />
        </>
    );
}
