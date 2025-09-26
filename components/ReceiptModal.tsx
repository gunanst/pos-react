import React from "react";
import { ReceiptItem } from "@/lib/receipt";

type ReceiptData = {
    items: ReceiptItem[];
    total: number;
    cash: number;
    change: number;
    cashierName: string;
    datetime: string;
    receiptNumber: string;
};

type ReceiptModalProps = {
    receiptData: ReceiptData;
    onClose: () => void;
};

export default function ReceiptModal({ receiptData, onClose }: ReceiptModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-2">
            <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full space-y-3">
                <h2 className="text-lg font-bold">Struk Transaksi</h2>
                <p className="text-sm">Kasir: {receiptData.cashierName}</p>
                <p className="text-sm">Tanggal: {receiptData.datetime}</p>
                <p className="text-sm">No. Struk: {receiptData.receiptNumber}</p>

                <div className="text-sm">
                    {receiptData.items.map((i) => (
                        <div key={i.id} className="flex justify-between">
                            <span>{i.name} x{i.qty}</span>
                            <span>Rp{(i.price * i.qty).toLocaleString("id-ID")}</span>
                        </div>
                    ))}
                </div>

                <hr />
                <p>
                    Total: <strong>Rp{receiptData.total.toLocaleString("id-ID")}</strong>
                </p>
                <p>Tunai: Rp{receiptData.cash.toLocaleString("id-ID")}</p>
                <p>Kembalian: Rp{receiptData.change.toLocaleString("id-ID")}</p>

                <button
                    onClick={onClose}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                >
                    Transaksi Baru
                </button>
                <button
                    onClick={() => window.print()}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded w-full"
                >
                    Print Struk
                </button>
            </div>
        </div>
    );
}
