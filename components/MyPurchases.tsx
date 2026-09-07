"use client";

import { useEffect, useState } from "react";
import { Loader2, PackageX, ChevronDown } from "lucide-react";
import OrderCard from "./ui/orderCard";
import OrderDetailModal from "@/components/modals/OrderDetailModal";
import { useDarkMode } from "@/context/DarkModeContext";

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

type GroupedOrder = {
  order_id: number;
  status: string;
  items: OrderItem[];
  totalAmount: number;
};

export default function MyPurchases() {
  const { isDarkMode } = useDarkMode();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
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

  const groupedOrdersMap = items.reduce(
    (acc, item) => {
      const orderId = item.order_id;
      if (!acc[orderId]) {
        acc[orderId] = {
          order_id: orderId,
          status: item.status,
          items: [],
          totalAmount: 0,
        };
      }
      acc[orderId].items.push(item);
      acc[orderId].totalAmount += Number(item.price) * Number(item.quantity);
      return acc;
    },
    {} as Record<number, GroupedOrder>,
  );

  const allOrders = Object.values(groupedOrdersMap).sort(
    (a, b) => b.order_id - a.order_id,
  );

  const availableStatuses = Array.from(
    new Set(allOrders.map((order) => order.status.toLowerCase())),
  ).filter((status) => status !== "paid");

  const filteredOrders =
    filterStatus === "all"
      ? allOrders.filter((order) => order.status.toLowerCase() !== "paid")
      : allOrders.filter(
          (order) => order.status.toLowerCase() === filterStatus,
        );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={24} className="animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between ${
          isDarkMode ? "border-zinc-800" : "border-zinc-200"
        }`}
      >
        <h2
          className={`font-mono text-xl font-bold tracking-tight ${
            isDarkMode ? "text-zinc-50" : "text-zinc-900"
          }`}
        >
          My Purchases
        </h2>

        <div className="relative inline-block">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`appearance-none rounded-lg border px-3 py-1.5 pr-8 font-mono text-xs font-medium outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 cursor-pointer ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
            }`}
          >
            <option value="all">
              All Orders (
              {
                allOrders.filter((o) => o.status.toLowerCase() !== "paid")
                  .length
              }
              )
            </option>
            {availableStatuses.map((status) => {
              const count = allOrders.filter(
                (o) => o.status.toLowerCase() === status,
              ).length;
              return (
                <option
                  key={status}
                  value={status}
                  className={
                    isDarkMode
                      ? "bg-zinc-900 text-zinc-300 capitalize"
                      : "bg-white text-zinc-700 capitalize"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                </option>
              );
            })}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center ${
            isDarkMode ? "border-zinc-800" : "border-zinc-300"
          }`}
        >
          <PackageX className="mb-2 h-8 w-8 text-zinc-500" />
          <p
            className={`font-mono text-sm ${
              isDarkMode ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            No orders found
          </p>
          <p className="text-xs text-zinc-500">
            {filterStatus === "all"
              ? "Your purchase history is empty."
              : `You have no orders with status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.order_id}
              order={order}
              onClick={() => setSelectedOrderId(order.order_id)}
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
