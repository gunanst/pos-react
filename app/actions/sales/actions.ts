"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
// ==========================
// Server Action: Buat transaksi
// ==========================
export async function createSaleAction(
  items: { productId: number; quantity: number }[],
) {
  if (items.length === 0) return { error: "Keranjang kosong" };

  // cek stok
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) return { error: "Produk tidak ditemukan" };
    if (product.stock < item.quantity)
      return { error: `Stok ${product.name} tidak cukup` };
  }

  const sale = await prisma.$transaction(async (tx) => {
    const newSale = await tx.sale.create({
      data: {
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Update stok produk
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newSale;
  });

  // Revalidate cache untuk page terkait
  revalidatePath("/sales");
  revalidatePath("/products");

  return { success: "Transaksi berhasil", sale };
}

// ==========================
// Server Function: Ambil riwayat penjualan
// ==========================
export async function getSalesHistory(from?: Date, to?: Date) {
  return prisma.sale.findMany({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCurrentUser() {
  try {
    // ⬇️ harus pakai await di server action
    const cookieStore = await cookies();
    const session = cookieStore.get("pos_session");

    if (!session) return null;

    let parsed: { id: number; role: string };
    try {
      parsed = JSON.parse(session.value);
    } catch {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: parsed.id },
      select: { id: true, name: true, role: true },
    });

    return user ?? null;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}
