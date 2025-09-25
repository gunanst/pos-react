"use client";

import { useState, startTransition } from "react";
import { createSaleAction } from "../actions"; // pastikan import Server Action

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
};

export default function Checkout({ products }: { products: Product[] }) {
    const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    function addToCart(product: Product) {
        if (product.stock <= 0) {
            setMessage(`Stok ${product.name} habis`);
            return;
        }
        setCart((prev) => {
            const exists = prev.find((i) => i.id === product.id);
            if (exists) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
            return [...prev, { ...product, qty: 1 }];
        });
    }

    function handleCheckout() {
        startTransition(async () => {
            const items = cart.map((i) => ({ productId: i.id, quantity: i.qty }));
            const result = await createSaleAction(items); // panggil Server Action
            if (result.error) setMessage(result.error);
            else {
                setMessage("✅ Transaksi berhasil!");
                setCart([]);
            }
        });
    }

    return (
        <div className="flex gap-8">
            {/* Produk */}
            <div className="w-1/2">
                <h2 className="font-semibold mb-2">Produk</h2>
                <ul className="space-y-2">
                    {products.map((p) => (
                        <li key={p.id} className="flex justify-between items-center border p-2 rounded">
                            <span>{p.name} - Rp{p.price} | Stok: {p.stock}</span>
                            <button
                                onClick={() => addToCart(p)}
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                Tambah
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Keranjang */}
            <div className="w-1/2">
                <h2 className="font-semibold mb-2">Keranjang</h2>
                {cart.length === 0 ? (
                    <p>Keranjang kosong</p>
                ) : (
                    <ul className="space-y-2">
                        {cart.map((i) => (
                            <li key={i.id} className="flex justify-between border p-2 rounded">
                                <span>{i.name} x {i.qty}</span>
                                <span>Rp{i.price * i.qty}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-4">
                    <p className="font-bold">
                        Total: Rp{cart.reduce((s, i) => s + i.price * i.qty, 0)}
                    </p>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="bg-green-600 text-white px-4 py-2 rounded mt-2 disabled:bg-gray-400"
                    >
                        Checkout
                    </button>
                    {message && <p className="mt-2 text-sm">{message}</p>}
                </div>
            </div>
        </div>
    );
}
