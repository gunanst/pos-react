"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

function validateProduct(
  barcode: string,
  name: string,
  price: number,
  stock: number,
): string | null {
  if (!name || name.length < 3) return "Nama minimal 3 huruf";
  if (price < 0) return "Harga tidak valid";
  if (stock < 0) return "Stok tidak boleh negatif";
  return null;
}

// CREATE
export async function addProduct(formData: FormData) {
  const barcode = formData.get("barcode")?.toString() || ""
  const name = formData.get("name")?.toString() || "";
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const imageFile = formData.get("image") as File | null;

  const error = validateProduct(barcode, name, price, stock);
  if (error) return { error };

  let imagePath: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const dir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const arrayBuffer = await imageFile.arrayBuffer();
    fs.writeFileSync(path.join(dir, fileName), Buffer.from(arrayBuffer));
    imagePath = `/uploads/${fileName}`;
  }

  await prisma.product.create({
    data: {
      barcode,
      name,
      price,
      stock,
      image: imagePath,
    },
  });

  // Revalidate halaman produk agar update realtime
  revalidatePath("/dashboard/products");

  return { success: "Produk berhasil ditambahkan" };
}

// UPDATE
export async function updateProduct(id: number, formData: FormData) {
  const barcode = formData.get("barcode")?.toString() || ""
  const name = formData.get("name")?.toString() || "";
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const imageFile = formData.get("image") as File | null;

  const error = validateProduct(barcode, name, price, stock);
  if (error) return { error };

  let imagePath: string | undefined = undefined;

  // Jika ada file baru diupload, simpan
  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const dir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const arrayBuffer = await imageFile.arrayBuffer();
    fs.writeFileSync(path.join(dir, fileName), Buffer.from(arrayBuffer));
    imagePath = `/uploads/${fileName}`;
  }

  await prisma.product.update({
    where: { id },
    data: {
      barcode,
      name,
      price,
      stock,
      ...(imagePath ? { image: imagePath } : {}), // update image hanya jika ada
    },
  });

  revalidatePath("/dashboard/products");

  return { success: "Produk berhasil diupdate" };
}

// DELETE
export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });

  revalidatePath("/dashboard/products");

  return { success: "Produk berhasil dihapus" };
}
