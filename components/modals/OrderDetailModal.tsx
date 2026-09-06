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

export default function OrderDetailModal({
  orderId,
  onClose,
}: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[5] border border-zinc-800 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-zinc-800 bg-zinc-950 text-emerald-400">
              <Package size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-mono text-sm font-bold tracking-wide text-zinc-100">
                  Order Details
                </h2>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-[5] p-2 cursor-pointer text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X size={18} />
          </button>
        </div>

        {loading || !order ? (
          <div className="flex items-center justify-center py-28">
            <Loader2 size={24} className="animate-spin text-emerald-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
            <div className="md:col-span-4">
              <div className="rounded-[5] border border-zinc-800/80 bg-zinc-950/40 p-5 shadow-sm flex flex-col h-full">
                <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Clock size={14} className="text-emerald-400" />
                  Order Progress
                </h3>
                <div className="relative flex flex-col justify-between flex-1 pl-2">
                  <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-zinc-800" />
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
                            <span className="absolute inline-flex h-full w-full animate-ping p-2 border rounded-full " />
                          )}
                          <div
                            className={`relative flex shrink-0 items-center justify-center rounded-full border transition-all ${
                              isCurrent
                                ? "border-emerald-400 p-0.5 animate-pulse bg-emerald-400 text-zinc-950"
                                : isPassed
                                  ? "border-emerald-400/50  bg-zinc-200/30 text-white-200"
                                  : "border-zinc-800 bg-zinc-900 text-zinc-600/0"
                            }`}
                          >
                            {!isPassed && !isCurrent ? (
                              <Check size={12} className="stroke-3" />
                            ) : (
                              <Check size={12} className="stroke-3" />
                            )}
                          </div>
                        </div>
                        <div>
                          <span
                            className={`font-mono text-xs uppercase tracking-wider block transition-colors ${
                              isCurrent
                                ? "font-bold text-zinc-200"
                                : isPassed
                                  ? "text-zinc-200/30 font-medium"
                                  : "text-zinc-600"
                            }`}
                          >
                            {status}
                          </span>
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
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                      Items Ordered ({items.length})
                    </h3>
                  </div>
                  <div className="space-y-1 max-h-75 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[5] border border-zinc-800/80 bg-zinc-950/40 p-4 transition-all hover:border-zinc-700"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[5] border border-zinc-800 bg-zinc-950">
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
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-zinc-100">
                                {item.product_name}
                              </p>
                              <p className="font-mono text-xs text-zinc-500">
                                ${Number(item.price).toFixed(2)} ×{" "}
                                {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-sm font-semibold text-zinc-100">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {isDelivered && (
                          <ItemReviewForm
                            productId={item.product_id}
                            is_reviewed={item.is_reviewed}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[5] border border-zinc-800/80 bg-zinc-950/40 p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-zinc-400">
                    <MapPin size={15} className="text-emerald-400" />
                    <span className="font-mono text-xs uppercase tracking-wider">
                      Delivery Details
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-zinc-100">
                      {order.shipping_name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {order.shipping_address}, {order.shipping_city}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono pt-0.5">
                      {order.shipping_phone}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-zinc-800/60 pt-2.5 text-zinc-400">
                    <CreditCard size={14} className="text-zinc-500" />
                    <span className="font-mono text-[11px] uppercase">
                      Method:{" "}
                      <strong className="text-zinc-300 font-normal">
                        {order.payment_method === "cod"
                          ? "Cash on Delivery"
                          : order.payment_method}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[5] border border-zinc-800/80 bg-zinc-950/40 p-4 shadow-sm">
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-zinc-200">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping Fee</span>
                    <span className="text-emerald-400 font-medium">Free</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-800/80 pt-3">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Total Amount
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-400">
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
