"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export default function EditProductButton({
    product,
    updateAction,
}: {
    product: { id: number; name: string; price: number; stock: number };
    updateAction: (id: number, formData: FormData) => Promise<{ error?: string; success?: string }>;
}) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
            >
                Edit
            </button>

            <Modal isOpen={open} onCloseAction={() => setOpen(false)}>
                <h2 className="font-bold mb-2">Edit Produk</h2>
                <form
                    action={async (formData: FormData) => {
                        const result = await updateAction(product.id, formData);
                        if (result.error) setMessage(result.error);
                        else setOpen(false);
                    }}
                    className="flex flex-col gap-2"
                >
                    <input
                        name="name"
                        defaultValue={product.name}
                        className="border px-2 py-1"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        defaultValue={product.price}
                        className="border px-2 py-1"
                        required
                    />
                    <input
                        type="number"
                        name="stock"
                        defaultValue={product.stock}
                        className="border px-2 py-1"
                        required
                    />
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="border px-2 py-1"
                    />
                    {message && <p className="text-red-500 text-sm">{message}</p>}
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                        Simpan
                    </button>
                </form>


            </Modal>
        </>
    );
}
