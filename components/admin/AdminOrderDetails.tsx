"use client";

import { X, User, Phone, Home, CreditCard } from "lucide-react";

type OrderItemRow = {
  item_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number | string;
  quantity: number;
  subtotal: number | string;
  shipping_name: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_phone?: string;
  payment_method?: string;
  email?: string;
  status: string;
  created_at?: string;
  image_url?: string;
};

interface AdminOrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  orderItems: OrderItemRow[];
  orderTotal: number;
}

export default function AdminOrderDetails({
  isOpen,
  onClose,
  orderId,
  orderItems,
  orderTotal,
}: AdminOrderDetailsProps) {
  if (!isOpen) return null;

  const firstItem = orderItems[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl font-mono text-xs text-zinc-300">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Order Details #{orderId}
            </h2>
            <p className="text-zinc-500 text-[11px]">
              {firstItem.created_at
                ? new Date(firstItem.created_at).toLocaleString()
                : "Recent Order"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 cursor-pointer hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3 space-y-2">
            <h3 className="text-[11px] font-bold uppercase text-zinc-400 mb-1">
              Customer & Shipping Info
            </h3>
            <div className="flex items-center gap-2 text-zinc-200">
              <User size={13} className="text-zinc-500 shrink-0" />
              <span>{firstItem.shipping_name || "Guest Customer"}</span>
            </div>
            {firstItem.shipping_phone && (
              <div className="flex items-center gap-2 text-zinc-300">
                <Phone size={13} className="text-zinc-500 shrink-0" />
                <span>{firstItem.shipping_phone}</span>
              </div>
            )}
            {firstItem.shipping_address && (
              <div className="flex items-start gap-2 text-zinc-300">
                <Home size={13} className="text-zinc-500 shrink-0 mt-0.5" />
                <span>
                  {firstItem.shipping_address}
                  {firstItem.shipping_city
                    ? `, ${firstItem.shipping_city}`
                    : ""}
                </span>
              </div>
            )}
            {firstItem.payment_method && (
              <div className="flex items-center gap-2 text-zinc-300 pt-1 border-t border-zinc-800/60">
                <CreditCard size={13} className="text-zinc-500 shrink-0" />
                <span className="uppercase font-semibold text-zinc-200">
                  Payment: {firstItem.payment_method}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
            <h3 className="text-[11px] font-bold uppercase text-zinc-400 mb-2">
              Ordered Items
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {orderItems.map((item) => (
                <div
                  key={item.item_id}
                  className="flex items-center justify-between border-b border-zinc-800/60 pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-emerald-400 font-bold">
                      {item.quantity}x
                    </span>
                    <span className="truncate text-zinc-200">
                      {item.product_name}
                    </span>
                  </div>
                  <span className="text-zinc-400 shrink-0">
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 pt-3 text-zinc-200 font-bold">
            <span>Total Amount:</span>
            <span className="text-emerald-400 text-sm">
              ${orderTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded border cursor-pointer border-zinc-700 bg-zinc-800 px-4 py-2 font-mono text-xs text-zinc-100 hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
