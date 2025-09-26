"use client";

export default function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Yakin hapus produk ini?")) return;

    await fetch(`/api/products/${id}/delete`, {
      method: "POST",
    });

    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-2 py-1 rounded"
    >
      Delete
    </button>
  );
}
