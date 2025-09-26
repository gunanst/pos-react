import { prisma } from "@/lib/prisma";
import AddUserForm from "../ui/AddUserForm";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen User</h1>

      <AddUserForm />

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Nama</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="border px-2 py-1">{u.name}</td>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
