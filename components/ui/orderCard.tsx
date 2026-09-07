"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
  created_at?: string;
};

type GroupedOrder = {
  order_id: number;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  created_at?: string;
};

type OrderCardProps = {
  order: GroupedOrder;
  onClick: () => void;
};

const getStatusTextColor = (status: string, isDarkMode: boolean) => {
  const s = status.toLowerCase();
  if (s === "pending") return isDarkMode ? "text-amber-400" : "text-amber-600";
  if (s === "processing") return isDarkMode ? "text-sky-400" : "text-sky-600";
  if (s === "dispatched")
    return isDarkMode ? "text-indigo-400" : "text-indigo-600";
  if (s === "transit")
    return isDarkMode ? "text-purple-400" : "text-purple-600";
  if (s === "out for delivery")
    return isDarkMode ? "text-cyan-400" : "text-cyan-600";
  if (s === "delivered" || s === "completed")
    return isDarkMode ? "text-emerald-400" : "text-emerald-600";
  if (s === "cancelled") return isDarkMode ? "text-rose-400" : "text-rose-600";
  return isDarkMode ? "text-zinc-400" : "text-zinc-500";
};

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const { isDarkMode } = useDarkMode();
  const statusColor = getStatusTextColor(order.status, isDarkMode);
  const rawDate = order.created_at || order.items?.[0]?.created_at;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-[5] border p-5 transition-all ${
        isDarkMode
          ? "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b pb-3 mb-4 ${
          isDarkMode ? "border-zinc-800/60" : "border-zinc-200"
        }`}
      >
        <div
          className={`flex items-center gap-2 font-mono text-xs ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          <span>
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </span>
          {formattedDate && (
            <>
              <span className={isDarkMode ? "text-zinc-600" : "text-zinc-300"}>
                |
              </span>
              <span>{formattedDate}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs font-medium uppercase tracking-wider ${statusColor}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item) => {
          const safePrice = Number(item.price) || 0;
          const safeQuantity = Number(item.quantity) || 1;
          return (
            <div key={item.id} className="flex items-center gap-4">
              <div
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-[5] border ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-950"
                    : "border-zinc-200 bg-zinc-100"
                }`}
              >
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span
                      className={`font-mono text-[9px] uppercase tracking-wider ${
                        isDarkMode ? "text-zinc-600" : "text-zinc-400"
                      }`}
                    >
                      No image
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-center gap-0.5">
                <p
                  className={`text-sm font-medium transition-colors line-clamp-1 ${
                    isDarkMode
                      ? "text-zinc-100 group-hover:text-white"
                      : "text-zinc-900 group-hover:text-black"
                  }`}
                >
                  {item.product_name}
                </p>
                <p
                  className={`font-mono text-xs ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-500"
                  }`}
                >
                  ${safePrice.toFixed(2)} × {safeQuantity}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`mt-4 flex items-center justify-between border-t pt-3 ${
          isDarkMode ? "border-zinc-800/60" : "border-zinc-200"
        }`}
      >
        <span
          className={`inline-flex items-center gap-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100 ${
            isDarkMode ? "text-emerald-400" : "text-emerald-600"
          }`}
        >
          View Details <ArrowRight size={12} />
        </span>
        <div className="flex items-center gap-3">
          <span
            className={`font-mono text-xs ${
              isDarkMode ? "text-zinc-500" : "text-zinc-500"
            }`}
          >
            Total Amount:
          </span>

          <span
            className={`font-mono text-sm font-semibold ${
              isDarkMode ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
