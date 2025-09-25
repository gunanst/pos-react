"use client";

import { useState, startTransition } from "react";
import { createSaleAction } from "../actions";

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
};

type User = {
    id: number;
    name: string;
    role: "ADMIN" | "KASIR";
};

type CheckoutProps = {
    products: Product[];
    user: User | null; // <--- bisa null
};

export default function Checkout({ products, user }: CheckoutProps) {
    const [cart, setCart] = useState<
        { id: number; name: string; price: number; qty: number }[]
    >([]);
    const [message, setMessage] = useState<string | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<{
        items: typeof cart;
        total: number;
        cashierName: string;
        datetime: string;
        receiptNumber: string;
    }>({ items: [], total: 0, cashierName: "", datetime: "", receiptNumber: "" });

    const cashierName = user?.name || "Kasir";

    function addToCart(product: Product) {
        if (product.stock <= 0) {
            setMessage(`Stok ${product.name} habis`);
            return;
        }
        setCart((prev) => {
            const exists = prev.find((i) => i.id === product.id);
            if (exists)
                return prev.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                );
            return [...prev, { ...product, qty: 1 }];
        });
    }

    function removeFromCart(id: number) {
        setCart((prev) => prev.filter((i) => i.id !== id));
    }

    function updateQty(id: number, qty: number) {
        if (qty < 1) return;
        setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    }

    function handleCheckout() {
        startTransition(async () => {
            const items = cart.map((i) => ({ productId: i.id, quantity: i.qty }));
            const result = await createSaleAction(items);

            if (result.error) {
                setMessage(result.error);
            } else {
                const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
                const datetime = new Date().toLocaleString();
                const receiptNumber = `POS-${Date.now()}`;
                setReceiptData({ items: cart, total, cashierName, datetime, receiptNumber });
                setShowReceipt(true);
                setCart([]);
            }
        });
    }

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Produk */}
            <div className="md:w-1/2 bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Produk</h2>
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-2 py-1 text-left">Nama</th>
                            <th className="border px-2 py-1 text-right">Harga</th>
                            <th className="border px-2 py-1 text-right">Stok</th>
                            <th className="border px-2 py-1 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition">
                                <td className="border px-2 py-1">{p.name}</td>
                                <td className="border px-2 py-1 text-right">
                                    Rp{p.price.toLocaleString("id-ID")}
                                </td>
                                <td className="border px-2 py-1 text-right">{p.stock}</td>
                                <td className="border px-2 py-1 text-center">
                                    <button
                                        onClick={() => addToCart(p)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                                    >
                                        Tambah
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Keranjang */}
            <div className="md:w-1/2 bg-white p-4 rounded-lg shadow flex flex-col justify-between">
                <h2 className="text-lg font-semibold mb-2">Keranjang ({cashierName})</h2>
                {cart.length === 0 ? (
                    <p className="text-gray-500">Keranjang kosong</p>
                ) : (
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-2 py-1 text-left">Produk</th>
                                <th className="border px-2 py-1 text-right">Qty</th>
                                <th className="border px-2 py-1 text-right">Subtotal</th>
                                <th className="border px-2 py-1 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((i) => (
                                <tr key={i.id} className="hover:bg-gray-50 transition">
                                    <td className="border px-2 py-1">{i.name}</td>
                                    <td className="border px-2 py-1 text-right">
                                        <input
                                            type="number"
                                            value={i.qty}
                                            onChange={(e) => updateQty(i.id, Number(e.target.value))}
                                            className="w-16 border rounded px-1 py-0.5 text-sm text-right"
                                            min={1}
                                        />
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                        Rp{(i.price * i.qty).toLocaleString()}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        <button
                                            onClick={() => removeFromCart(i.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="mt-4 border-t pt-3">
                    <p className="font-bold text-lg">Total: Rp{total.toLocaleString()}</p>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2 w-full disabled:bg-gray-400 transition"
                    >
                        Checkout
                    </button>
                    {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
                </div>
            </div>

            {/* Modal Struk */}
            {showReceipt && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-2">
                        <h2 className="text-xl font-bold mb-2">Struk Transaksi</h2>
                        <p className="text-sm mb-1">
                            Kasir: <strong>{receiptData.cashierName}</strong>
                        </p>
                        <p className="text-sm mb-2">
                            Tanggal: <strong>{receiptData.datetime}</strong>
                        </p>
                        <p className="text-sm mb-2">
                            No. Struk: <strong>{receiptData.receiptNumber}</strong>
                        </p>
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-2 py-1 text-left">Produk</th>
                                    <th className="border px-2 py-1 text-right">Qty</th>
                                    <th className="border px-2 py-1 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receiptData.items.map((i) => (
                                    <tr key={i.id}>
                                        <td className="border px-2 py-1">{i.name}</td>
                                        <td className="border px-2 py-1 text-right">{i.qty}</td>
                                        <td className="border px-2 py-1 text-right">
                                            Rp{(i.price * i.qty).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="font-bold text-lg mt-2">
                            Total: Rp{receiptData.total.toLocaleString()}
                        </p>
                        <button
                            onClick={() => setShowReceipt(false)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
                        >
                            Transaksi Baru
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-2 w-full"
                        >
                            Print Struk
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
