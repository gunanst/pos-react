import { prisma } from "@/lib/prisma";
import Checkout from "./ui/Checkout";

export default async function SalesPage() {
    const products = await prisma.product.findMany();

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Kasir</h1>
            </div>

            {/* Checkout Area */}
            <div className="bg-white rounded-lg shadow p-6">
                <Checkout products={products} />
            </div>
        </div>
    );
}
