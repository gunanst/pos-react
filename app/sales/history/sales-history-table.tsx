"use client";

export default function SalesHistoryTable({
    sales,
}: {
    sales: any[];
}) {
    if (sales.length === 0) return <p>Tidak ada transaksi pada periode ini.</p>;

    return (
        <ul className="space-y-4">
            {sales.map((sale) => {
                const total = sale.items.reduce(
                    (sum: number, i: any) => sum + i.product.price * i.quantity,
                    0
                );
                return (
                    <li key={sale.id} className="border rounded p-4">
                        <div className="font-semibold">
                            Transaksi #{sale.id} -{" "}
                            {new Date(sale.createdAt).toLocaleString("id-ID")}
                        </div>
                        <ul className="mt-2 space-y-1">
                            {sale.items.map((i: any) => (
                                <li key={i.id} className="flex justify-between">
                                    <span>
                                        {i.product.name} x {i.quantity}
                                    </span>
                                    <span>Rp{i.product.price * i.quantity}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-2 font-bold">Total: Rp{total}</div>
                    </li>
                );
            })}
        </ul>
    );
}
