"use client";

export default function Modal({
    isOpen,
    onCloseAction,
    children,
}: {
    isOpen: boolean;
    onCloseAction: () => void;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg min-w-[300px]">
                {children}
                <button
                    onClick={onCloseAction}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}
