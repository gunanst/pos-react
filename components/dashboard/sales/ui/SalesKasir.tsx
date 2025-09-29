"use client";

import { useState } from "react";
import { createSaleAction } from "@/app/actions/sales/actions";
import ReceiptModal from "@/components/ReceiptModal";
import CartModal from "@/components/CartModal";
import { Product, CartItem, ReceiptData, Props } from "@/lib/types";
import Image from "next/image";

export default function SalesKasir({ products, user }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cash, setCash] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [receiptData, setReceiptData] = useState<ReceiptData>(null);
    const [showCartModal, setShowCartModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // <-- state loading

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const change = cash - total;
    const cashierName = user?.name || "Kasir";

    const addToCartAction = (product: Product) => {
        if (product.stock <= 0) {
            setMessage(`Stok ${product.name} habis`);
            return;
        }

        setCart((prev) => {
            const exist = prev.find((i) => i.id === product.id);
            if (exist) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
        });

        setMessage(null);
    };

    const updateQtyAction = (id: number, qty: number) => {
        if (qty < 1) return;
        setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    };

    const removeItem = (id: number) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    const handleCheckout = async () => {
        if (isProcessing) return; // cegah klik ganda

        if (cash < total) {
            setMessage("Tunai kurang dari total.");
            return;
        }

        setIsProcessing(true);

        try {
            const items = cart.map((i) => ({ productId: i.id, quantity: i.qty }));
            const result = await createSaleAction(items);

            if (result?.error) {
                setMessage(result.error);
                setIsProcessing(false);
                return;
            }

            const datetime = new Date().toLocaleString("id-ID");
            const receiptNumber = `POS-${Date.now()}`;
            setReceiptData({
                items: cart,
                total,
                cash,
                change,
                cashierName,
                datetime,
                receiptNumber,
            });

            setCart([]);
            setCash(0);
            setMessage(null);
            setShowCartModal(false);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage("Terjadi kesalahan saat proses checkout.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowCartModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition"
                >
                    🛒 Buka Keranjang
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md max-h-[85vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-6">🧾 Daftar Produk</h2>

                <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => addToCartAction(p)}
                            className="cursor-pointer w-full border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white"
                        >
                            <Image
                                src={p.image ?? "/placeholder.png"}
                                alt={p.name}
                                width={60}
                                height={60}
                                className="rounded mb-2 object-cover"
                            />

                            <div className="text-lg font-semibold text-gray-800 mb-1">{p.name}</div>
                            <div className="text-sm text-gray-600 mb-1">
                                Rp{p.price.toLocaleString("id-ID")}
                            </div>
                            <div
                                className={`text-sm font-medium ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}
                            >
                                Stok: {p.stock}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CartModal
                show={showCartModal}
                onCloseAction={() => setShowCartModal(false)}
                cart={cart}
                products={products}
                addToCartAction={addToCartAction}
                total={total}
                cash={cash}
                setCashAction={setCash}
                change={change}
                message={message}
                setMessageAction={setMessage}
                updateQtyAction={updateQtyAction}
                removeItemAction={removeItem}
                handleCheckoutAction={handleCheckout}
                isProcessing={isProcessing} // kirim status loading ke modal
            />

            {receiptData && (
                <ReceiptModal
                    receiptData={receiptData}
                    onClose={() => setReceiptData(null)}
                />
            )}
        </>
    );
}
