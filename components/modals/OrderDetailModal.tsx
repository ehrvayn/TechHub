"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Loader2,
  Check,
  Package,
  MapPin,
  CreditCard,
  Clock,
} from "lucide-react";
import { ItemReviewForm } from "../ui/ItemReviewForm";
import { useDarkMode } from "@/context/DarkModeContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

export type OrderDetail = {
  id: number;
  status: string;
  total: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
  payment_method: string;
};

export type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  is_reviewed: boolean;
};

export type OrderDetailModalProps = {
  orderId: number;
  onClose: () => void;
};

const STATUSES = [
  "pending",
  "processing",
  "dispatched",
  "transit",
  "out for delivery",
  "delivered",
];
const DELIVERED_STATUSES = ["delivered", "completed"];

const STATUS_DESCRIPTIONS: Record<string, string> = {
  pending: "Your order has been received and is waiting to be processed.",
  processing: "Your order is currently being prepared for shipment.",
  dispatched: "Your order has been dispatched and is on its way.",
  transit: "Your order is currently in transit to your area.",
  "out for delivery": "Your order is out for delivery and should arrive soon.",
  delivered: "Your order has been successfully delivered.",
};

export default function OrderDetailModal({
  orderId,
  onClose,
}: OrderDetailModalProps) {
  const { isDarkMode } = useDarkMode();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  useBodyScrollLock(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        setOrder(data.order);
        setItems(data.items ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const currentStepIndex = order
    ? STATUSES.indexOf(order.status.toLowerCase())
    : -1;
  const isDelivered = order
    ? DELIVERED_STATUSES.includes(order.status.toLowerCase())
    : false;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md animate-in fade-in duration-200 sm:p-4 ${
        isDarkMode ? "bg-black/80" : "bg-black/60"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative h-full max-h-full w-full max-w-none overflow-y-auto border-0 shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:rounded-[5px] sm:border ${
          isDarkMode
            ? "border-zinc-800 bg-zinc-900"
            : "border-zinc-200 bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`sticky top-0 z-20 flex items-center justify-between border-b px-6 py-4 backdrop-blur ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-900/95"
              : "border-zinc-200 bg-white/95"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center border ${
                isDarkMode
                  ? "border-zinc-800 bg-zinc-950 text-emerald-400"
                  : "border-zinc-200 bg-zinc-50 text-emerald-500"
              }`}
            >
              <Package size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2
                  className={`font-mono text-sm font-bold tracking-wide ${
                    isDarkMode ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  Order Details
                </h2>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`rounded-[5px] p-2 cursor-pointer transition-colors ${
              isDarkMode
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {loading || !order ? (
          <div className="flex items-center justify-center py-28">
            <Loader2
              size={24}
              className={`animate-spin ${
                isDarkMode ? "text-emerald-400" : "text-emerald-500"
              }`}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
            <div className="md:col-span-4">
              <div
                className={`rounded-[5px] border p-5 shadow-sm flex flex-col h-full ${
                  isDarkMode
                    ? "border-zinc-800/80 bg-zinc-950/40"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <h3
                  className={`mb-4 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  <Clock
                    size={14}
                    className={
                      isDarkMode ? "text-emerald-400" : "text-emerald-500"
                    }
                  />
                  Order Progress
                </h3>
                <div className="relative flex flex-col justify-between flex-1 pl-2">
                  <div
                    className={`absolute left-3.5 top-3 bottom-3 w-0.5 ${
                      isDarkMode ? "bg-zinc-800" : "bg-zinc-200"
                    }`}
                  />
                  {STATUSES.map((status, i) => {
                    const isPassed = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    return (
                      <div
                        key={status}
                        className="flex items-center gap-3.5 relative z-10"
                      >
                        <div className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                          {isCurrent && (
                            <span
                              className={`absolute inline-flex h-full w-full animate-ping p-2 border rounded-full ${
                                isDarkMode
                                  ? "border-emerald-400"
                                  : "border-emerald-500"
                              }`}
                            />
                          )}
                          <div
                            className={`relative flex shrink-0 items-center justify-center rounded-full border transition-all ${
                              isCurrent
                                ? isDarkMode
                                  ? "border-emerald-400 p-0.5 animate-pulse bg-emerald-400 text-zinc-950"
                                  : "border-emerald-500 p-0.5 animate-pulse bg-emerald-500 text-white"
                                : isPassed
                                  ? isDarkMode
                                    ? "border-emerald-400/50 bg-zinc-200/30 text-white"
                                    : "border-emerald-500/50 bg-zinc-200 text-white"
                                  : isDarkMode
                                    ? "border-zinc-800 bg-zinc-900 text-transparent"
                                    : "border-zinc-300 bg-white text-transparent"
                            }`}
                          >
                            <Check size={12} className="stroke-3" />
                          </div>
                        </div>
                        <div>
                          <span
                            className={`font-mono text-xs uppercase tracking-wider block transition-colors ${
                              isCurrent
                                ? isDarkMode
                                  ? "font-bold text-zinc-200"
                                  : "font-bold text-zinc-900"
                                : isPassed
                                  ? isDarkMode
                                    ? "text-zinc-200/50 font-medium"
                                    : "text-zinc-600 font-medium"
                                  : isDarkMode
                                    ? "text-zinc-600"
                                    : "text-zinc-400"
                            }`}
                          >
                            {status}
                          </span>

                          {isCurrent && (
                            <p
                              className={`mt-1 max-w-xs text-[11px] leading-relaxed ${
                                isDarkMode ? "text-zinc-500" : "text-zinc-500"
                              }`}
                            >
                              {STATUS_DESCRIPTIONS[status]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3
                      className={`font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      Items Ordered ({items.length})
                    </h3>
                  </div>
                  <div className="space-y-1 max-h-75 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-[5px] border p-4 transition-all ${
                          isDarkMode
                            ? "border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700"
                            : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-[5px] border ${
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
                                      isDarkMode
                                        ? "text-zinc-600"
                                        : "text-zinc-500"
                                    }`}
                                  >
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p
                                className={`text-sm font-medium ${
                                  isDarkMode ? "text-zinc-100" : "text-zinc-900"
                                }`}
                              >
                                {item.product_name}
                              </p>
                              <p className="font-mono text-xs text-zinc-500">
                                ${Number(item.price).toFixed(2)} ×{" "}
                                {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`font-mono text-sm font-semibold ${
                              isDarkMode ? "text-zinc-100" : "text-zinc-900"
                            }`}
                          >
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {isDelivered && (
                          <ItemReviewForm
                            orderItemId={item.id}
                            productId={item.product_id}
                            is_reviewed={item.is_reviewed}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`rounded-[5px] border p-4 shadow-sm ${
                    isDarkMode
                      ? "border-zinc-800/80 bg-zinc-950/40"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <div
                    className={`mb-2 flex items-center gap-2 ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    <MapPin
                      size={15}
                      className={
                        isDarkMode ? "text-emerald-400" : "text-emerald-500"
                      }
                    />
                    <span className="font-mono text-xs uppercase tracking-wider">
                      Delivery Details
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <p
                      className={`text-sm font-semibold ${
                        isDarkMode ? "text-zinc-100" : "text-zinc-900"
                      }`}
                    >
                      {order.shipping_name}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      {order.shipping_address}, {order.shipping_city}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono pt-0.5">
                      {order.shipping_phone}
                    </p>
                  </div>
                  <div
                    className={`mt-3 flex items-center gap-2 border-t pt-2.5 ${
                      isDarkMode
                        ? "border-zinc-800/60 text-zinc-400"
                        : "border-zinc-200 text-zinc-600"
                    }`}
                  >
                    <CreditCard size={14} className="text-zinc-500" />
                    <span className="font-mono text-[11px] uppercase">
                      Method:{" "}
                      <strong
                        className={`font-normal ${
                          isDarkMode ? "text-zinc-300" : "text-zinc-800"
                        }`}
                      >
                        {order.payment_method === "cod"
                          ? "Cash on Delivery"
                          : order.payment_method}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-[5px] border p-4 shadow-sm ${
                  isDarkMode
                    ? "border-zinc-800/80 bg-zinc-950/40"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <div className="space-y-2 font-mono text-xs">
                  <div
                    className={`flex justify-between ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    <span>Subtotal</span>
                    <span
                      className={isDarkMode ? "text-zinc-200" : "text-zinc-900"}
                    >
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    <span>Shipping Fee</span>
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      Free
                    </span>
                  </div>
                </div>
                <div
                  className={`mt-3 flex items-center justify-between border-t pt-3 ${
                    isDarkMode ? "border-zinc-800/80" : "border-zinc-200"
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? "text-zinc-300" : "text-zinc-800"
                    }`}
                  >
                    Total Amount
                  </span>
                  <span
                    className={`font-mono text-base font-bold ${
                      isDarkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
