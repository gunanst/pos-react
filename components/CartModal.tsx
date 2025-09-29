"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type CartItem = {
    id: number;
    name: string;
    price: number;
    qty: number;
};

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    barcode: string;
};

type Props = {
    show: boolean;
    onCloseAction: () => void;
    cart: CartItem[];
    products: Product[];
    addToCartAction: (product: Product) => void;
    total: number;
    cash: number;
    setCashAction: (value: number) => void;
    change: number;
    message: string | null;
    setMessageAction: (msg: string | null) => void;
    updateQtyAction: (id: number, qty: number) => void;
    removeItemAction: (id: number) => void;
    handleCheckoutAction: () => Promise<void>;
};

export default function CartModal({
    show,
    onCloseAction,
    cart,
    products,
    addToCartAction,
    total,
    cash,
    setCashAction,
    change,
    message,
    setMessageAction,
    updateQtyAction,
    removeItemAction,
    handleCheckoutAction,
}: Props) {
    const [barcode, setBarcode] = useState<string>("");
    const [scannerReady, setScannerReady] = useState(false);
    const barcodeRef = useRef<HTMLInputElement>(null);
    const scannerRef = useRef<HTMLDivElement>(null);

    // Fokuskan input barcode saat modal muncul
    useEffect(() => {
        if (show) {
            barcodeRef.current?.focus();
        }
    }, [show]);

    // Buat handleScan stabil dengan useCallback
    const handleScan = useCallback(
        (code: string) => {
            const trimmedCode = code.trim();
            if (!trimmedCode) return;

            const product = products.find((p) => p.barcode === trimmedCode);
            if (!product) {
                setMessageAction("Produk tidak ditemukan.");
                return;
            }
            addToCartAction(product);
            setBarcode("");
            barcodeRef.current?.focus();
        },
        [products, addToCartAction, setMessageAction]
    );

    // Setup scanner QR hanya sekali saat show=true dan scanner belum ready
    useEffect(() => {
        if (show && !scannerReady && scannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scanner.render(
                (decodedText: string) => {
                    setBarcode(decodedText);
                    handleScan(decodedText);
                },
                () => {
                    // error callback kosong
                }
            );

            setScannerReady(true);
        }
    }, [show, scannerReady, handleScan]);

    if (!show) return null;

    // Filter produk untuk autocomplete hasil scan / input manual
    const filteredProducts = products.filter((p) =>
        p.barcode.toLowerCase().includes(barcode.toLowerCase()) ||
        p.name.toLowerCase().includes(barcode.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-xl max-h-[90vh] overflow-auto animate-fade-in">
                <h2 className="text-2xl font-bold mb-5 text-blue-700 flex items-center gap-2">
                    🛒 Keranjang Belanja
                </h2>

                {/* Input Barcode / Nama */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Scan atau cari produk</label>
                    <input
                        ref={barcodeRef}
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleScan(barcode)}
                        placeholder="Scan barcode atau ketik nama produk..."
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                    />

                    {barcode.trim() !== "" && (
                        <div className="mt-2 border rounded-lg p-2 max-h-48 overflow-auto bg-gray-50">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="cursor-pointer flex justify-between items-center p-2 hover:bg-blue-100 rounded transition"
                                        onClick={() => {
                                            addToCartAction(product);
                                            setBarcode("");
                                            barcodeRef.current?.focus();
                                        }}
                                    >
                                        <div>
                                            <div className="font-medium">{product.name}</div>
                                            <div className="text-xs text-gray-500">
                                                Rp{product.price.toLocaleString("id-ID")} • Stok: {product.stock}
                                            </div>
                                        </div>
                                        <span className="text-blue-600 text-sm">+ Tambah</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">Tidak ditemukan.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Kamera */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Scanner Kamera</label>
                    <div
                        ref={scannerRef}
                        id="qr-reader"
                        className="w-full max-w-xs rounded overflow-hidden border"
                    />
                </div>

                {/* Item di Keranjang */}
                <div className="mb-6 border rounded-lg p-3 bg-gray-50 max-h-64 overflow-auto">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400">Keranjang kosong.</div>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center py-2 border-b last:border-none"
                            >
                                <div>
                                    <div className="font-semibold text-gray-800">{item.name}</div>
                                    <div className="text-sm text-gray-600">
                                        Rp{item.price.toLocaleString("id-ID")} ×{" "}
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.qty}
                                            onChange={(e) => updateQtyAction(item.id, Number(e.target.value))}
                                            className="w-14 border rounded px-2 py-0.5 text-center ml-1"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItemAction(item.id)}
                                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                                    title="Hapus"
                                    aria-label={`Hapus ${item.name} dari keranjang`}
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Ringkasan Transaksi */}
                <div className="mb-6 space-y-2 text-sm bg-white border rounded-lg p-4">
                    <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>Rp{total.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="cash-input" className="mr-2">
                            Tunai:
                        </label>
                        <input
                            id="cash-input"
                            type="number"
                            min={0}
                            value={cash}
                            onChange={(e) => setCashAction(Number(e.target.value))}
                            className="border rounded px-3 py-1 w-32"
                        />
                    </div>
                    <div className="flex justify-between font-semibold text-green-700">
                        <span>Kembalian:</span>
                        <span>Rp{change >= 0 ? change.toLocaleString("id-ID") : "0"}</span>
                    </div>
                    {message && <div className="text-red-600 mt-2">{message}</div>}
                </div>

                {/* Tombol */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCloseAction}
                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleCheckoutAction}
                        className={`px-4 py-2 rounded-md transition text-white ${cart.length === 0
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        disabled={cart.length === 0}
                    >
                        Bayar
                    </button>
                </div>
            </div>
        </div>
    );
}
