import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/sales/actions";
import SalesKasir from "@/components/dashboard/sales/ui/SalesKasir";

export default async function SalesPage() {
  const products = await prisma.product.findMany();
  const user = await getCurrentUser();

  return <SalesKasir products={products} user={user} />;
}
