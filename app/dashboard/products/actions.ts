"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function validateProduct(name: string, price: number, stock: number): string | null {
  if (!name || name.length < 3) return "Nama minimal 3 huruf";
  if (price < 0) return "Harga tidak valid";
  if (stock < 0) return "Stok tidak boleh negatif";
  return null;
}

// CREATE
export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));

  const error = validateProduct(name, price, stock);
  if (error) return { error };

  await prisma.product.create({ data: { name, price, stock } });
  revalidatePath("/products");
  return { success: "Produk berhasil ditambahkan" };
}

// UPDATE
export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));

  const error = validateProduct(name, price, stock);
  if (error) return { error };

  await prisma.product.update({
    where: { id },
    data: { name, price, stock },
  });
  revalidatePath("/products");
  return { success: "Produk berhasil diupdate" };
}

// DELETE
export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/products");
  return { success: "Produk berhasil dihapus" };
}
