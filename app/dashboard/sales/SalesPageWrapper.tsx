"use client";

import { useState, useEffect } from "react";
import Checkout from "../../../components/dashboard/sales/ui/Checkout";

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

type Props = {
    products: Product[];
    user: User | null;
};

export default function SalesPageWrapper({ products, user }: Props) {
    const [showCheckout, setShowCheckout] = useState(false);

    // useEffect(() => {
    //     setShowCheckout(true); // langsung buka modal saat load halaman
    // }, []);

    return (
        <div className="px-4 py-6 space-y-6 sm:px-6 relative min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Kasir</h1>
            </div>

            {/* Konten halaman bisa ditaruh di sini jika perlu */}

            {/* Modal Checkout */}
            {showCheckout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-full overflow-auto relative">
                        {/* Tombol Close */}
                        <button
                            onClick={() => setShowCheckout(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            aria-label="Close checkout modal"
                        >
                            &times;
                        </button>

                        <Checkout products={products} user={user} />
                    </div>
                </div>
            )}
        </div>
    );
}
