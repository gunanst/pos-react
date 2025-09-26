import { prisma } from "@/lib/prisma";
import Checkout from "../../../components/dashboard/sales/ui/Checkout";
import { getCurrentUser } from "../../actions/sales/actions";

export default async function SalesPage() {
  const products = await prisma.product.findMany();
  const user = await getCurrentUser();

  return (
    <div className="px-4 py-6 space-y-6 sm:px-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Kasir</h1>
      </div>

      {/* Checkout Area */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <Checkout products={products} user={user} />
      </div>
    </div>
  );
}
