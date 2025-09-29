import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../lib/auth.js";

async function main() {
  // Admin
  const adminPassword = await hashPassword("admin123");
  await prisma.user.upsert({
    where: { email: "admin@pos.com" },
    update: {
      // jika user sudah ada, update nama / password misalnya
      name: "Admin POS",
      password: adminPassword,
      role: "ADMIN"
    },
    create: {
      name: "Admin POS",
      email: "admin@pos.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Kasir
  const kasirPassword = await hashPassword("kasir123");
  await prisma.user.upsert({
    where: { email: "kasir@pos.com" },
    update: {
      name: "Kasir POS",
      password: kasirPassword,
      role: "KASIR"
    },
    create: {
      name: "Kasir POS",
      email: "kasir@pos.com",
      password: kasirPassword,
      role: "KASIR",
    },
  });

  console.log("Users created!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
