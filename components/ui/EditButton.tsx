"use client";

import { useRouter } from "next/navigation";

export default function EditButton({ id }: { id: string }) {
  const router = useRouter();

  function handleEdit() {
    router.push(`/products/${id}/edit`);
  }

  return (
    <button
      onClick={handleEdit}
      className="bg-yellow-500 text-white px-2 py-1 rounded"
    >
      Edit
    </button>
  );
}

//code diatas untuk mengganti fungsi ini di halaman product/page.tsx
//<Link href={`/products/${p.id}/edit`}className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</Link>