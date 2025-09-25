import { prisma } from "@/lib/prisma";
import { addProduct, updateProduct, deleteProduct } from "./actions";
import AddProductButton from "@/components/ui/AddProductButton";
import EditProductButton from "@/components/ui/EditProductButton";

export default async function ProductsPage() {
    const products = await prisma.product.findMany();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manajemen Produk</h1>

            <AddProductButton addAction={addProduct} />

            <ul className="mt-4 space-y-2">
                {products.map((p) => (
                    <li key={p.id} className="flex justify-between items-center border p-2 rounded">
                        <span>
                            {p.name} - Rp{p.price} | Stok: {p.stock}
                        </span>
                        <div className="flex gap-2">
                            <EditProductButton product={p} updateAction={updateProduct} />
                            <form action={async () => {
                                "use server";
                                await deleteProduct(p.id);
                            }}>
                                <button className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                            </form>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
