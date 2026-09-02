"use client";

import { useEffect, useState } from "react";
import { Loader2, PackageX } from "lucide-react";
import OrderItemCard from "@/components/ui/orderItemCard";
import OrderDetailModal from "@/components/modals/OrderDetailModal";

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: string | number;
  quantity: number;
  status: string;
  image_url: string | null;
};

type TabType = "all" | "pending" | "completed";

export default function MyPurchases() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setItems(data.orders || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const pendingItems = items.filter(
    (item) => item.status.toLowerCase() === "pending",
  );
  const completedItems = items.filter(
    (item) => item.status.toLowerCase() !== "pending",
  );

  const filteredItems =
    activeTab === "pending"
      ? pendingItems
      : activeTab === "completed"
        ? completedItems
        : items;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={24} className="animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-mono text-xl font-bold tracking-tight text-zinc-50">
          My Purchases
        </h2>

        <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              activeTab === "all"
                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              activeTab === "pending"
                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Pending ({pendingItems.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              activeTab === "completed"
                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Paid ({completedItems.length})
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 py-16 text-center">
          <PackageX className="mb-2 h-8 w-8 text-zinc-600" />
          <p className="font-mono text-sm text-zinc-400">No items found</p>
          <p className="text-xs text-zinc-600">
            {activeTab === "pending"
              ? "You have no pending orders right now."
              : activeTab === "completed"
                ? "You have no completed or paid purchases yet."
                : "Your purchase history is empty."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredItems.map((item) => (
            <OrderItemCard
              key={item.id}
              id={item.id}
              name={item.product_name}
              price={Number(item.price)}
              quantity={item.quantity}
              status={item.status}
              imageUrl={item.image_url}
              onClick={() => setSelectedOrderId(item.order_id)}
            />
          ))}
        </div>
      )}

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
