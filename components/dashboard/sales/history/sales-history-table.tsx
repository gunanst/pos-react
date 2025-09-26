"use client";
import { Sale, SaleItem } from "@/lib/types";
const formatRupiah = (amount: number) => `Rp${amount.toLocaleString("id-ID")}`;

export default function SalesHistoryTable({ sales }: { sales: Sale[] }) {
  if (!sales || sales.length === 0)
    return (
      <p className="text-gray-500 text-center py-6">
        Tidak ada transaksi pada periode ini.
      </p>
    );

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-2">Tanggal</th>
            <th className="px-4 py-2">ID Transaksi</th>
            <th className="px-4 py-2">Produk</th>
            <th className="px-4 py-2 text-center">Qty</th>
            <th className="px-4 py-2 text-right">Harga</th>
            <th className="px-4 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) =>
            sale.items.map((i: SaleItem, index: number) => (
              <tr
                key={`${sale.id}-${i.id}`}
                className="border-t hover:bg-gray-50"
              >
                {index === 0 && (
                  <>
                    <td
                      className="px-4 py-2 align-top"
                      rowSpan={sale.items.length}
                    >
                      {new Date(sale.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td
                      className="px-4 py-2 font-medium align-top"
                      rowSpan={sale.items.length}
                    >
                      #{sale.id}
                    </td>
                  </>
                )}
                <td className="px-4 py-2">{i.product.name}</td>
                <td className="px-4 py-2 text-center">{i.quantity}</td>
                <td className="px-4 py-2 text-right">
                  {formatRupiah(i.product.price)}
                </td>
                <td className="px-4 py-2 text-right">
                  {formatRupiah(i.product.price * i.quantity)}
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
