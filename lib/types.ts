// types.ts

// Tipe untuk produk
export type Product = {
    id: number;
    name: string;
    image: string | null; // nullable kalau gambar gak wajib
    price: number;
    stock: number;
    barcode: string;
};

// Tipe untuk user/kasir/admin
export type User = {
    id: number;
    name: string;
    email?: string; // opsional
    role: "ADMIN" | "KASIR" | string; // bisa diperketat lagi sesuai kebutuhan
    isActive?: boolean; // opsional
};

// Detail item penjualan
export type SaleItem = {
    id: number;
    saleId: number;
    productId: number;
    quantity: number;
    product: Product; // relasi dengan produk
};

// Transaksi penjualan
export type Sale = {
    id: number;
    createdAt: Date;
    items: SaleItem[];
};

// Item yang ada di keranjang (dan juga untuk receipt item)
export type CartItem = {
    id: number;
    name: string;
    price: number;
    qty: number;
};

// Data untuk nota/receipt, memakai CartItem sebagai item-nya
export type ReceiptData = {
    items: CartItem[];
    total: number;
    cash: number;
    change: number;
    cashierName: string;
    datetime: string;
    receiptNumber: string;
} | null;

// Props umum untuk komponen SalesKasir (produk + user)
export type Props = {
    products: Product[];
    user: User | null;
};

// Props khusus untuk modal checkout/keranjang
export type CheckoutModalProps = {
    cart: CartItem[];
    cashierName: string;
    total: number;
    cash: number;
    change: number;
    message: string | null;
    updateQty: (id: number, qty: number) => void;
    removeFromCart: (id: number) => void;
    setCash: (cash: number) => void;
    handleCheckout: () => void;
    onClose: () => void;
};
export type ReceiptItem = {
    id: number;
    name: string;
    qty: number;
    price: number;
};

