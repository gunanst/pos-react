import { prisma } from "@/lib/prisma";
import { addProduct, updateProduct, deleteProduct } from "@/app/actions/products/actions";
import AddProductButton from "@/components/dashboard/products/AddProductButton";
import EditProductButton from "@/components/dashboard/products/EditProductButton";
import Image from "next/image";

export default async function ProductsPage() {
  const products = await prisma.product.findMany();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Manajemen Produk</h1>
        <AddProductButton addAction={addProduct} />
      </div>

      {/* Tabel (Hanya tampil di layar >= md) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">No</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Barcode</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Nama</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Harga</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Stok</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-sm">{index + 1}</td>
                <td className="p-3 text-sm">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded" />
                  )}
                </td>
                <td className="p-3 text-sm">{p.name}</td>
                <td className="p-3 text-sm">{p.barcode}</td>
                <td className="p-3 text-sm">Rp{p.price.toLocaleString()}</td>
                <td className="p-3 text-sm">{p.stock}</td>
                <td className="p-3 text-sm flex gap-2">
                  <EditProductButton product={p} updateAction={updateProduct} />
                  <form
                    action={async () => {
                      "use server";
                      await deleteProduct(p.id);
                    }}
                  >
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kartu (Hanya tampil di layar < md) */}
      <div className="md:hidden space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              {p.image ? (
                <Image
                  src={p.image} //url
                  alt={p.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded" />
              )}
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <p className="text-gray-600">Rp{p.price.toLocaleString()}</p>
                <p className="text-gray-600">Stok: {p.stock}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <EditProductButton product={p} updateAction={updateProduct} />
              <form
                action={async () => {
                  "use server";
                  await deleteProduct(p.id);
                }}
                className="flex-1"
              >
                <button type="submit" className="w-full bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                  Hapus
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
