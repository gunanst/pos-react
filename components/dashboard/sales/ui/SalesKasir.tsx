"use client";

import { useState } from "react";
import { createSaleAction } from "@/app/actions/sales/actions";
import ReceiptModal from "@/components/ReceiptModal";
import CartModal from "@/components/CartModal";

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    barcode: string;
};

type User = {
    id: number;
    name: string;
    role: "ADMIN" | "KASIR";
};

type Props = {
    products: Product[];
    user: User | null;
};

type CartItem = {
    id: number;
    name: string;
    price: number;
    qty: number;
};

type ReceiptData = {
    items: CartItem[];
    total: number;
    cash: number;
    change: number;
    cashierName: string;
    datetime: string;
    receiptNumber: string;
} | null;

export default function SalesKasir({ products, user }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cash, setCashAction] = useState(0);
    const [message, setMessageAction] = useState<string | null>(null);
    const [receiptData, setReceiptData] = useState<ReceiptData>(null);
    const [showCartModal, setShowCartModal] = useState(false);

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const change = cash - total;
    const cashierName = user?.name || "Kasir";

    const addToCartAction = (product: Product) => {
        if (product.stock <= 0) {
            setMessageAction(`Stok ${product.name} habis`);
            return;
        }

        setCart((prev) => {
            const exist = prev.find((i) => i.id === product.id);
            if (exist) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [
                ...prev,
                { id: product.id, name: product.name, price: product.price, qty: 1 },
            ];
        });

        setMessageAction(null);
    };

    const updateQtyAction = (id: number, qty: number) => {
        if (qty < 1) return;
        setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    };

    const removeItem = (id: number) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    const handleCheckout = async () => {
        if (cash < total) {
            setMessageAction("Tunai kurang dari total.");
            return;
        }

        const items = cart.map((i) => ({ productId: i.id, quantity: i.qty }));
        const result = await createSaleAction(items);

        if (result?.error) {
            setMessageAction(result.error);
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
        setCashAction(0);
        setMessageAction(null);
        setShowCartModal(false);
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => addToCartAction(p)}
                            className="cursor-pointer w-full border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white"
                        >
                            <div className="text-lg font-semibold text-gray-800 mb-1">
                                {p.name}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                                Rp{p.price.toLocaleString("id-ID")}
                            </div>
                            <div
                                className={`text-sm font-medium ${p.stock > 0 ? "text-green-600" : "text-red-500"
                                    }`}
                            >
                                Stok: {p.stock}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Keranjang */}
            <CartModal
                show={showCartModal}
                onCloseAction={() => setShowCartModal(false)}
                cart={cart}
                products={products}
                addToCartAction={addToCartAction}
                total={total}
                cash={cash}
                setCashAction={setCashAction}
                change={change}
                message={message}
                setMessageAction={setMessageAction}
                updateQtyAction={updateQtyAction}
                removeItemAction={removeItem}
                handleCheckoutAction={handleCheckout}
            />

            {/* Nota */}
            {receiptData && (
                <ReceiptModal
                    receiptData={receiptData}
                    onClose={() => setReceiptData(null)}
                />
            )}
        </>
    );
}
