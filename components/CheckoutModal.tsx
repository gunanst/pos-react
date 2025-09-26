import React from "react";

type CartItem = { id: number; name: string; price: number; qty: number };

type CheckoutModalProps = {
    cart: CartItem[];
    cashierName: string;
    total: number;
    cash: number;
    change: number;
    message: string | null;
    updateQty: (id: number, qty: number) => void;
    removeFromCart: (id: number) => void;
    setCash: (cash: number) => void;
    handleCheckout: () => void;
    onClose: () => void;
};

export default function CheckoutModal({
    cart,
    cashierName,
    total,
    cash,
    change,
    message,
    updateQty,
    removeFromCart,
    setCash,
    handleCheckout,
    onClose,
}: CheckoutModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end sm:items-center px-2 py-6">
            <div className="bg-white rounded-t-lg sm:rounded-lg shadow-lg w-full max-w-md p-4 space-y-3 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold">Keranjang ({cashierName})</h2>

                {cart.length === 0 ? (
                    <p className="text-gray-500">Keranjang kosong.</p>
                ) : (
                    <div className="space-y-2">
                        {cart.map((i) => (
                            <div key={i.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{i.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="number"
                                            min={1}
                                            value={i.qty}
                                            onChange={(e) => updateQty(i.id, Number(e.target.value))}
                                            className="w-16 border rounded px-2 py-1 text-right"
                                        />
                                        <span className="text-sm">
                                            = Rp{(i.price * i.qty).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(i.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Hapus
                                </button>
                            </div>
                        ))}

                        <div className="border-t pt-3 space-y-2">
                            <p className="font-bold text-lg">
                                Total: Rp{total.toLocaleString("id-ID")}
                            </p>
                            <label className="block text-sm">Tunai (Rp):</label>
                            <input
                                type="number"
                                value={cash}
                                onChange={(e) => setCash(Number(e.target.value))}
                                className="w-full border rounded px-2 py-1 text-right"
                                min={0}
                            />
                            {cash >= total && (
                                <p className="text-sm text-green-600 font-semibold">
                                    Kembalian: Rp{change.toLocaleString("id-ID")}
                                </p>
                            )}
                            {message && <p className="text-sm text-red-600">{message}</p>}
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full disabled:bg-gray-400 transition"
                            >
                                Checkout
                            </button>
                            <button
                                onClick={onClose}
                                className="text-center text-sm text-gray-500 mt-2 w-full"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
