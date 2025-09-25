import { getSalesHistory } from "../actions";
import { Suspense } from "react";
import SalesHistoryTable from "./sales-history-table";

export default async function SalesHistoryPage({
    searchParams,
}: {
    searchParams?: { from?: string; to?: string };
}) {
    const from = searchParams?.from ? new Date(searchParams.from) : undefined;
    const to = searchParams?.to ? new Date(searchParams.to) : undefined;

    const sales = await getSalesHistory(from, to);

    // Hitung total omzet & total produk terjual
    const grandTotal = sales.reduce(
        (sum, sale) =>
            sum +
            sale.items.reduce(
                (sub, i) => sub + i.product.price * i.quantity,
                0
            ),
        0
    );

    const totalQty = sales.reduce(
        (sum, sale) =>
            sum +
            sale.items.reduce((sub, i) => sub + i.quantity, 0),
        0
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Riwayat Penjualan</h1>

            <form className="flex gap-2 mb-4">
                <input
                    type="date"
                    name="from"
                    defaultValue={searchParams?.from || ""}
                    className="border p-2 rounded"
                />
                <input
                    type="date"
                    name="to"
                    defaultValue={searchParams?.to || ""}
                    className="border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Filter
                </button>
            </form>

            <Suspense fallback={<p>Loading...</p>}>
                <SalesHistoryTable sales={sales} />
            </Suspense>

            <div className="mt-6 p-4 border rounded bg-gray-100">
                <p className="text-lg font-semibold">
                    Total Penjualan: Rp{grandTotal}
                </p>
                <p className="text-lg font-semibold">
                    Jumlah Produk Terjual: {totalQty}
                </p>
            </div>
        </div>
    );
}
