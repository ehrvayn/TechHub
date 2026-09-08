"use client";

import { X, User, Phone, Home, CreditCard } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

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
  const { isDarkMode } = useDarkMode();
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const firstItem = orderItems[0];

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm sm:p-4 ${
        isDarkMode ? "bg-black/70" : "bg-black/40"
      }`}
    >
      <div
        className={`h-full max-h-full w-full max-w-none overflow-y-auto border-0 p-4 shadow-xl font-mono text-xs sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-lg sm:border sm:p-6 ${
          isDarkMode
            ? "border-zinc-800 bg-zinc-900 text-zinc-300"
            : "border-zinc-200 bg-white text-zinc-700"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b pb-4 mb-4 ${
            isDarkMode ? "border-zinc-800" : "border-zinc-200"
          }`}
        >
          <div>
            <h2
              className={`text-sm font-bold uppercase tracking-wider ${
                isDarkMode ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              Order Details
            </h2>
            <p className="text-zinc-500 text-[11px]">
              {firstItem.created_at
                ? new Date(firstItem.created_at).toLocaleString()
                : "Recent Order"}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`rounded border cursor-pointer px-4 py-2 font-mono text-xs transition-colors ${
                isDarkMode
                  ? "border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                  : "border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div
            className={`rounded-md border p-3 space-y-2 ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-950"
                : "border-zinc-200 bg-zinc-50"
            }`}
          >
            <h3
              className={`text-[11px] pb-1 border-b font-bold uppercase mb-1 ${
                isDarkMode
                  ? "border-zinc-800/60 text-zinc-400"
                  : "border-zinc-200 text-zinc-600"
              }`}
            >
              Customer & Shipping Info
            </h3>
            <div
              className={`flex items-center gap-2 ${
                isDarkMode ? "text-zinc-200" : "text-zinc-800"
              }`}
            >
              <User size={13} className="text-zinc-500 shrink-0" />
              <span>{firstItem.shipping_name || "Guest Customer"}</span>
            </div>
            {firstItem.shipping_phone && (
              <div
                className={`flex items-center gap-2 ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                <Phone size={13} className="text-zinc-500 shrink-0" />
                <span>{firstItem.shipping_phone}</span>
              </div>
            )}
            {firstItem.shipping_address && (
              <div
                className={`flex items-start gap-2 ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
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
              <div
                className={`flex items-center gap-2 pt-1 border-t ${
                  isDarkMode ? "border-zinc-800/60" : "border-zinc-200"
                }`}
              >
                <CreditCard size={13} className="text-zinc-500 shrink-0" />
                <span
                  className={`uppercase font-semibold ${
                    isDarkMode ? "text-zinc-200" : "text-zinc-800"
                  }`}
                >
                  Payment: {firstItem.payment_method}
                </span>
              </div>
            )}
          </div>

          <div
            className={`rounded-md border p-3 ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-950"
                : "border-zinc-200 bg-zinc-50"
            }`}
          >
            <h3
              className={`text-[11px] font-bold uppercase mb-2 ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Ordered Items
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {orderItems.map((item) => (
                <div
                  key={item.item_id}
                  className={`flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 ${
                    isDarkMode ? "border-zinc-800/60" : "border-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`font-bold ${
                        isDarkMode ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      {item.quantity}x
                    </span>
                    <span
                      className={`truncate ${
                        isDarkMode ? "text-zinc-200" : "text-zinc-800"
                      }`}
                    >
                      {item.product_name}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`flex items-center justify-between border-t pt-3 font-bold ${
              isDarkMode
                ? "border-zinc-800 text-zinc-200"
                : "border-zinc-200 text-zinc-800"
            }`}
          >
            <span>Total Amount:</span>
            <span
              className={`text-sm ${
                isDarkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              ${orderTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
