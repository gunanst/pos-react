// /app/access-denied/page.tsx
export default function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
            {/* Judul halaman akses ditolak */}
            <h1 className="text-4xl font-bold mb-4 text-red-600">Akses Ditolak</h1>

            {/* Penjelasan singkat kenapa akses ditolak */}
            <p className="mb-6 text-gray-700 text-center max-w-md">
                Maaf, Anda tidak memiliki izin untuk membuka halaman ini.
            </p>

            {/* Tombol kembali ke dashboard */}
            <a
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Kembali ke Dashboard
            </a>
        </div>
    );
}
