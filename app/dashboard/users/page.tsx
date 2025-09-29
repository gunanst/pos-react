import { prisma } from "@/lib/prisma";
import AddUserForm from "../../../components/dashboard/ui/AddUserForm";
import UsersTable from "./UserTable";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen User</h1>

      <AddUserForm />

      {/* Pass users ke client component */}
      <UsersTable users={users} />
    </div>
  );
}
