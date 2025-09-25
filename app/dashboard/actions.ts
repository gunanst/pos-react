"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Ambil dashboard data
export async function getDashboardData() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Total produk
    const totalProducts = await prisma.product.count();

    // Transaksi hari ini
    const salesToday = await prisma.sale.findMany({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
        include: { items: { include: { product: true } } },
    });

    const totalOmzet = salesToday.reduce(
        (sum, sale) =>
            sum + sale.items.reduce((s, i) => s + i.product.price * i.quantity, 0),
        0
    );

    const totalQtySold = salesToday.reduce(
        (sum, sale) => sum + sale.items.reduce((s, i) => s + i.quantity, 0),
        0
    );

    // 5 transaksi terakhir
    const latestSales = await prisma.sale.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
    });

    // Data chart: omzet per jam
    const salesPerHour: { hour: string; total: number }[] = [];
    for (let h = 0; h < 24; h++) {
        const start = new Date(todayStart);
        start.setHours(h, 0, 0, 0);
        const end = new Date(todayStart);
        end.setHours(h, 59, 59, 999);

        const hourlySales = salesToday.filter(
            (s) => s.createdAt >= start && s.createdAt <= end
        );

        const total = hourlySales.reduce(
            (sum, sale) =>
                sum + sale.items.reduce((s, i) => s + i.product.price * i.quantity, 0),
            0
        );

        salesPerHour.push({ hour: `${h}:00`, total });
    }

    return { totalProducts, totalOmzet, totalQtySold, latestSales, salesPerHour };
}


export async function getCurrentUser() {
    try {
        // await cookies() karena sekarang mengembalikan Promise
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;

        if (!userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { id: true, name: true, role: true },
        });

        return user ?? null;
    } catch (err) {
        console.error("Error getCurrentUser:", err);
        return null;
    }
}
