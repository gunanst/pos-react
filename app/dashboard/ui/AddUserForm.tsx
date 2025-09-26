"use client";

import { useState } from "react";
import { createUserAction } from "../users/actions";

export default function AddUserForm() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        const res = await createUserAction(formData);
        if (res.error) setMessage(res.error);
        else setMessage(res.success!);
      }}
      className="space-y-3 border p-4 rounded bg-white shadow"
    >
      <h2 className="font-semibold">Tambah User Baru</h2>
      <input
        name="name"
        placeholder="Nama"
        className="border px-2 py-1 w-full"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border px-2 py-1 w-full"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border px-2 py-1 w-full"
        required
      />
      <select name="role" className="border px-2 py-1 w-full">
        <option value="KASIR">Kasir</option>
        <option value="ADMIN">Admin</option>
      </select>
      {message && <p className="text-sm text-green-600">{message}</p>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Simpan
      </button>
    </form>
  );
}
