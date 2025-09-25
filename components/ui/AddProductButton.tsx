// AddProductButton.tsx
"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export default function AddProductButton({
    addAction,
}: {
    addAction: (formData: FormData) => Promise<{ error?: string; success?: string }>;
}) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
            >
                Tambah Produk
            </button>

            <Modal isOpen={open} onCloseAction={() => setOpen(false)}>
                <h2 className="font-bold mb-2">Tambah Produk</h2>
                <form
                    action={async (formData) => {
                        const result = await addAction(formData);
                        if (result.error) setMessage(result.error);
                        else setOpen(false);
                    }}
                    className="flex flex-col gap-2"
                    encType="multipart/form-data"
                >
                    <input name="name" placeholder="Nama produk" className="border px-2 py-1" required />
                    <input type="number" name="price" placeholder="Harga" className="border px-2 py-1" required />
                    <input type="number" name="stock" placeholder="Stok" className="border px-2 py-1" required />
                    <input type="file" name="image" accept="image/*" className="border px-2 py-1" />
                    {message && <p className="text-red-500 text-sm">{message}</p>}
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Simpan</button>
                </form>

            </Modal>
        </>
    );
}
