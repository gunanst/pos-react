"use client";

import React, { useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
};


type UsersTableProps = {
    users: User[];
};

export default function UsersTable({ users }: UsersTableProps) {
    const [userList, setUserList] = useState<User[]>(users);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [newPassword, setNewPassword] = useState("");

    async function toggleActive(id: number, currentStatus: boolean) {
        await fetch(`/api/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ isActive: !currentStatus }),
            headers: { "Content-Type": "application/json" },
        });

        setUserList((prev) =>
            prev.map((u) => (u.id === id ? { ...u, isActive: !currentStatus } : u))
        );
    }

    async function changePassword(id: number) {
        if (!newPassword) return alert("Password cannot be empty");

        await fetch(`/api/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ password: newPassword }),
            headers: { "Content-Type": "application/json" },
        });

        alert("Password updated");
        setEditingUserId(null);
        setNewPassword("");
    }

    return (
        <div className="overflow-x-auto" >
            <table className="min-w-full border-collapse mt-4" >
                <thead>
                    <tr className="bg-gray-200" >
                        <th className="border px-2 py-1" > Nama </th>
                        < th className="border px-2 py-1" > Email </th>
                        < th className="border px-2 py-1" > Role </th>
                        < th className="border px-2 py-1" > Status </th>
                        < th className="border px-2 py-1" > Password </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userList.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition" >
                                <td className="border px-2 py-1" > {u.name} </td>
                                < td className="border px-2 py-1" > {u.email} </td>
                                < td className="border px-2 py-1" > {u.role} </td>
                                < td className="border px-2 py-1" >
                                    <button
                                        className={`px-2 py-1 rounded ${u.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                            }`}
                                        onClick={() => toggleActive(u.id, u.isActive)
                                        }
                                    >
                                        {u.isActive ? "Aktif" : "Nonaktif"}
                                    </button>
                                </td>
                                < td className="border px-2 py-1" >
                                    {editingUserId === u.id ? (
                                        <>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="border px-1 py-1 mr-2"
                                                placeholder="New Password"
                                            />
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                                onClick={() => changePassword(u.id)}
                                            >
                                                Save
                                            </button>
                                            < button
                                                className="ml-2 px-2 py-1 rounded border"
                                                onClick={() => setEditingUserId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                                            onClick={() => setEditingUserId(u.id)}
                                        >
                                            Ganti Password
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
