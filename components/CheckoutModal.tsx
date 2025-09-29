import React from "react";
import { CheckoutModalProps } from "@/lib/types";

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
        <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center px-4 py-6 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-t-lg sm:rounded-lg shadow-lg w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <header className="flex justify-between items-center border-b pb-2 mb-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Keranjang <span className="text-sm text-gray-500">({cashierName})</span>
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Tutup modal"
                        className="text-gray-400 hover:text-gray-700 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">Keranjang kosong.</p>
                ) : (
                    <>
                        <ul className="space-y-4">
                            {cart.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between border rounded p-3 shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex flex-col flex-grow">
                                        <span className="font-semibold text-gray-800">{item.name}</span>
                                        <div className="flex items-center gap-3 mt-1">
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.qty}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    if (val > 0) updateQty(item.id, val);
                                                }}
                                                className="w-20 border border-gray-300 rounded px-3 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                = Rp{(item.price * item.qty).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-4 text-red-600 hover:text-red-800 transition flex items-center"
                                        aria-label={`Hapus ${item.name} dari keranjang`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t pt-4 space-y-3">
                            <p className="text-lg font-bold text-gray-900">
                                Total: Rp{total.toLocaleString("id-ID")}
                            </p>

                            <label htmlFor="cash" className="block text-sm font-medium text-gray-700">
                                Tunai (Rp):
                            </label>
                            <input
                                id="cash"
                                type="number"
                                value={cash}
                                onChange={(e) => setCash(Number(e.target.value))}
                                className={`w-full border rounded px-3 py-2 text-right text-sm
                  focus:outline-none focus:ring-2 focus:ring-green-500 transition
                  ${cash < total ? "border-red-400" : "border-gray-300"}`}
                                min={0}
                            />

                            {cash >= total && (
                                <p className="text-sm text-green-700 font-semibold">
                                    Kembalian: Rp{change.toLocaleString("id-ID")}
                                </p>
                            )}
                            {message && (
                                <p className="text-sm text-red-600 font-medium">{message}</p>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || cash < total}
                                className={`w-full py-3 rounded text-white font-semibold
                  transition
                  ${cart.length === 0 || cash < total
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
