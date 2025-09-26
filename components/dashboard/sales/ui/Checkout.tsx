"use client";

import { useState, startTransition } from "react";
import { createSaleAction } from "../../../../app/actions/sales/actions";
import { ReceiptItem } from "@/lib/receipt";
import CheckoutModal from "../../../../components/CheckoutModal";
import ReceiptModal from "../../../../components/ReceiptModal";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type User = {
  id: number;
  name: string;
  role: "ADMIN" | "KASIR";
};

type CheckoutProps = {
  products: Product[];
  user: User | null;
};

type ReceiptData = {
  items: ReceiptItem[];
  total: number;
  cash: number;
  change: number;
  cashierName: string;
  datetime: string;
  receiptNumber: string;
};

export default function Checkout({ products, user }: CheckoutProps) {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [cash, setCash] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const cashierName = user?.name || "Kasir";
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const change = cash - total;

  function addToCart(product: Product) {
    if (product.stock <= 0) {
      setMessage(`Stok ${product.name} habis`);
      return;
    }

    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id: number, qty: number) {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  function handleCheckout() {
    if (cash < total) {
      setMessage("Nominal tunai kurang dari total belanja.");
      return;
    }

    startTransition(async () => {
      const items = cart.map((i) => ({ productId: i.id, quantity: i.qty }));
      const result = await createSaleAction(items);

      if (result.error) {
        setMessage(result.error);
      } else {
        const datetime = new Date().toLocaleString("id-ID");
        const receiptNumber = `POS-${Date.now()}`;
        setReceiptData({
          items: cart,
          total,
          cash,
          change,
          cashierName,
          datetime,
          receiptNumber,
        });
        setShowReceipt(true);
        setCart([]);
        setCash(0);
        setMessage(null);
        setShowCheckout(false);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="fixed bottom-4 right-4 z-40">
        {cart.length > 0 && (
          <button
            onClick={() => setShowCheckout(true)}
            className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg text-lg"
          >
            🛒 {cart.reduce((s, i) => s + i.qty, 0)} | Rp{total.toLocaleString("id-ID")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => addToCart(p)}
            className="bg-white shadow rounded p-4 text-left flex flex-col hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500">Rp{p.price.toLocaleString("id-ID")}</p>
            <span className="text-xs text-gray-400">Stok: {p.stock}</span>
          </button>
        ))}
      </div>

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          cashierName={cashierName}
          total={total}
          cash={cash}
          change={change}
          message={message}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          setCash={setCash}
          handleCheckout={handleCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {showReceipt && receiptData && (
        <ReceiptModal receiptData={receiptData} onClose={() => setShowReceipt(false)} />
      )}
    </div>
  );
}
