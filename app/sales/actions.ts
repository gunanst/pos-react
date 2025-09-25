"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================
// Server Action: Buat transaksi
// ==========================
export async function createSaleAction(items: { productId: number; quantity: number }[]) {
    if (items.length === 0) return { error: "Keranjang kosong" };

    // cek stok
    for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) return { error: "Produk tidak ditemukan" };
        if (product.stock < item.quantity) return { error: `Stok ${product.name} tidak cukup` };
    }

    const sale = await prisma.$transaction(async (tx) => {
        const newSale = await tx.sale.create({
            data: { items: { create: items.map(i => ({ productId: i.productId, quantity: i.quantity })) } },
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
