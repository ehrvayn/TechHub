"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: string | number;
  quantity: number;
  status: string;
  image_url: string | null;
  created_at?: string; // added optional date field
};

type GroupedOrder = {
  order_id: number;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  created_at?: string; // added optional date field
};

type OrderCardProps = {
  order: GroupedOrder;
  onClick: () => void;
};

const getStatusTextColor = (status: string) => {
  const s = status.toLowerCase();
  if (s === "pending") return "text-amber-400";
  if (s === "processing") return "text-sky-400";
  if (s === "dispatched") return "text-indigo-400";
  if (s === "transit") return "text-purple-400";
  if (s === "out for delivery") return "text-cyan-400";
  if (s === "delivered" || s === "completed") return "text-emerald-400";
  if (s === "cancelled") return "text-rose-400";
  return "text-zinc-400";
};

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const statusColor = getStatusTextColor(order.status);
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
      className="group cursor-pointer rounded-[5] border border-zinc-800/80 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
    >
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-4">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span>
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </span>
          {formattedDate && (
            <>
              <span className="text-zinc-600">|</span>
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
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[5] border border-zinc-800 bg-zinc-950">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">
                      No image
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-center gap-0.5">
                <p className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors line-clamp-1">
                  {item.product_name}
                </p>
                <p className="font-mono text-xs text-zinc-500">
                  ${safePrice.toFixed(2)} × {safeQuantity}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3">
        <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
          View Details <ArrowRight size={12} />
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-zinc-500">Total Amount:</span>

          <span className="font-mono text-sm font-semibold text-zinc-100">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
