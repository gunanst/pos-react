"use client";

import Checkout from "@/components/dashboard/sales/ui/Checkout";

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

export default function SalesClient({ products, user }: Props) {
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">🧾 Transaksi Kasir</h1>
            </div>

            <Checkout products={products} user={user} />
        </div>
    );
}
