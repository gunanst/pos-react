import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

async function main() {
  // Admin
  const adminPassword = await hashPassword("admin123");
  await prisma.user.upsert({
    where: { email: "admin@pos.com" },
    update: {},
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
    update: {},
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
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
