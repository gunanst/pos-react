"use client";
import { Product, CartItem } from "@/lib/types";

type CartModalProps = {
    show: boolean;
    onCloseAction: () => void;
    cart: CartItem[];
    products: Product[];
    addToCartAction: (product: Product) => void;
    total: number;
    cash: number;
    setCashAction: (cash: number) => void;
    change: number;
    message: string | null;
    setMessageAction: (msg: string | null) => void;
    updateQtyAction: (id: number, qty: number) => void;
    removeItemAction: (id: number) => void;
    handleCheckoutAction: () => void;
    isProcessing: boolean; // status loading dari parent
};

export default function CartModal({
    show,
    onCloseAction,
    cart,
    total,
    cash,
    setCashAction,
    change,
    message,
    removeItemAction,
    handleCheckoutAction,
    isProcessing,
}: CartModalProps) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Keranjang Belanja</h3>

                {/* List item keranjang */}
                {cart.length === 0 ? (
                    <p className="mb-4">Keranjang kosong</p>
                ) : (
                    <ul className="mb-4">
                        {cart.map((item) => (
                            <li key={item.id} className="flex justify-between items-center mb-2">
                                <div>
                                    <strong>{item.name}</strong> x {item.qty}
                                </div>
                                <div>
                                    <button
                                        className="text-red-500 hover:text-red-700 ml-2"
                                        onClick={() => removeItemAction(item.id)}
                                        disabled={isProcessing}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mb-4">
                    <label className="block mb-1">Tunai:</label>
                    <input
                        type="number"
                        value={cash}
                        onChange={(e) => setCashAction(Number(e.target.value))}
                        disabled={isProcessing}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>

                <div className="mb-4">
                    <p>Total: Rp{total.toLocaleString("id-ID")}</p>
                    <p>Kembalian: Rp{change.toLocaleString("id-ID")}</p>
                </div>

                {message && <p className="text-red-600 mb-2">{message}</p>}

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCloseAction}
                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                        disabled={isProcessing}
                    >
                        Batal
                    </button>

                    <button
                        onClick={handleCheckoutAction}
                        disabled={isProcessing}
                        className={`bg-green-600 text-white font-semibold px-4 py-2 rounded shadow transition
                            ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
                    >
                        {isProcessing ? "Memproses..." : "Bayar"}
                    </button>
                </div>
            </div>
        </div>
    );
}