"use client";

type ModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onCloseAction, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 bg-black bg-opacity-20 flex items-start justify-center z-50 p-6"
      onClick={onCloseAction} // klik di overlay menutup modal
    >
      {/* Form box tetap kecil */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // klik di dalam modal tidak menutup
      >
        {children}
      </div>
    </div>
  );
}
