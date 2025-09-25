import { prisma } from "@/lib/prisma";
import Checkout from "./ui/Checkout";

export default async function SalesPage() {
    const products = await prisma.product.findMany();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Kasir</h1>
            <Checkout products={products} />
        </div>
    );
}
