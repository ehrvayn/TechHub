"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, PackageX, ChevronDown } from "lucide-react";
import AdminOrderCard from "./AdminOrdersCard";

type OrderItemRow = {
  item_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number | string;
  quantity: number;
  subtotal: number | string;
  shipping_name: string;
  status: string;
  created_at?: string;
  image_url?: string;
};

export default function AdminOrdersFeed() {
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<string>("all");

  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrderItems = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();

      if (Array.isArray(data)) setItems(data);
      else if (Array.isArray(data.items)) setItems(data.items);
      else if (Array.isArray(data.orders)) setItems(data.orders);
      else setItems([]);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderItems();
  }, []);

  const handleStartEdit = (orderId: number, currentStatus: string) => {
    setEditingOrderId(orderId);
    setSelectedStatus(currentStatus.toLowerCase());
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setSelectedStatus("");
  };

  const handleSaveStatus = async (orderId: number) => {
    if (!selectedStatus) return;
    setUpdatingId(orderId);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.order_id === orderId
              ? { ...item, status: selectedStatus }
              : item,
          ),
        );
        setEditingOrderId(null);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const itemStatus = item.status.toLowerCase();
    let matchesSort = true;

    if (selectedSort === "pending") matchesSort = itemStatus === "pending";
    else if (selectedSort === "processing")
      matchesSort = itemStatus === "processing";
    else if (selectedSort === "dispatched")
      matchesSort = itemStatus === "dispatched";
    else if (selectedSort === "transit") matchesSort = itemStatus === "transit";
    else if (selectedSort === "out_for_delivery")
      matchesSort = itemStatus === "out_for_delivery";
    else if (selectedSort === "completed")
      matchesSort =
        itemStatus === "completed" ||
        itemStatus === "paid" ||
        itemStatus === "delivered";
    else if (selectedSort === "cancelled")
      matchesSort = itemStatus === "cancelled";

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.order_id.toString().includes(query) ||
      item.product_name.toLowerCase().includes(query) ||
      (item.shipping_name && item.shipping_name.toLowerCase().includes(query));

    return matchesSort && matchesSearch;
  });

  const groupedOrders = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    },
    {} as Record<number, OrderItemRow[]>,
  );

  const sortedOrderEntries = Object.entries(groupedOrders).sort(
    ([idA], [idB]) => {
      if (selectedSort === "oldest") {
        return Number(idA) - Number(idB);
      }
      return Number(idB) - Number(idA);
    },
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={24} className="animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Search product, customer, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/80 py-2 pl-9 pr-4 font-mono text-xs text-zinc-100 placeholder:text-zinc-500 transition-all focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
          />
        </div>

        <div className="relative flex items-center">
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="appearance-none rounded-md border border-zinc-800 bg-zinc-900/80 px-3 py-2 pr-8 font-mono text-xs text-zinc-200 outline-none transition-colors hover:border-zinc-700 focus:border-emerald-400 cursor-pointer"
          >
            <option value="newest">Recent</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="dispatched">Dispatched</option>
            <option value="transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="oldest">Oldest</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 text-zinc-400 pointer-events-none"
          />
        </div>
      </div>

      {sortedOrderEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 py-16 text-center">
          <PackageX className="mb-2 h-8 w-8 text-zinc-600" />
          <p className="font-mono text-xs text-zinc-500">
            No matching order items found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrderEntries.map(([orderIdStr, orderItems]) => {
            const orderId = Number(orderIdStr);
            return (
              <AdminOrderCard
                key={orderId}
                orderId={orderId}
                orderItems={orderItems}
                isEditing={editingOrderId === orderId}
                isUpdating={updatingId === orderId}
                selectedStatus={selectedStatus}
                onSelectStatus={setSelectedStatus}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onSaveStatus={handleSaveStatus}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
