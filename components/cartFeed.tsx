"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import CartItemCard from "@/components/ui/cartItemCard";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  image_url: string | null;
};

function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const router = useRouter();

  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleSelectAll = () => {
    setSelectedIds(
      allSelected ? new Set() : new Set(items.map((item) => item.id)),
    );
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingId(id);
    await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    await fetchCart();
    setUpdatingId(null);
  };

  const removeItem = async (id: number) => {
    setUpdatingId(id);
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    await fetchCart();
    setUpdatingId(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={20} className="animate-spin text-zinc-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-16 text-center">
        <p className="font-mono text-sm text-zinc-500">Your cart is empty.</p>
      </div>
    );
  }
  const goToCheckout = () => {
    if (selectedIds.size === 0) return;
    const itemsParam = Array.from(selectedIds).join(",");
    router.push(`/checkout?items=${itemsParam}`);
  };

  const selectedTotal = items
    .filter((item) => selectedIds.has(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleSelectAll}
          className="h-3.5 w-3.5 accent-emerald-400"
        />
        <span className="font-mono text-xs uppercase tracking-wide text-zinc-500">
          Select all
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <CartItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            stock={item.stock}
            quantity={item.quantity}
            imageUrl={item.image_url}
            selected={selectedIds.has(item.id)}
            updating={updatingId === item.id}
            onToggleSelect={toggleSelected}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
        <div className="flex flex-col">
          <span className="font-mono text-xs text-zinc-500">
            Total ({selectedIds.size} selected)
          </span>
          <span className="font-mono text-lg font-semibold text-zinc-50">
            ${selectedTotal.toFixed(2)}
          </span>
        </div>
        <button
          onClick={goToCheckout}
          disabled={selectedIds.size === 0}
          className="rounded-sm bg-emerald-400 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CartClient;
