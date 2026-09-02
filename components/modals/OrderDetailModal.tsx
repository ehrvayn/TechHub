"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

const STATUSES = ["pending", "paid", "preparing", "shipped", "delivered"];

type OrderDetail = {
  id: number;
  status: string;
  total: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
  payment_method: string;
};

type OrderItem = {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
};

type OrderDetailModalProps = {
  orderId: number;
  onClose: () => void;
};

function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      setOrder(data.order);
      setItems(data.items ?? []);
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  const currentStepIndex = order ? STATUSES.indexOf(order.status) : -1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900 p-5">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-sm font-medium text-zinc-100">
            Order #{orderId} details
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        </div>

        {loading || !order ? (
          <div className="flex justify-center py-10">
            <Loader2 size={20} className="animate-spin text-zinc-600" />
          </div>
        ) : (
          <>
            {/* Status timeline */}
            <div className="mb-6 flex items-center">
              {STATUSES.map((status, i) => (
                <div
                  key={status}
                  className="flex flex-1 items-center last:flex-none"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        i <= currentStepIndex ? "bg-emerald-400" : "bg-zinc-700"
                      }`}
                    />
                    <span
                      className={`mt-1.5 font-mono text-[9px] uppercase ${
                        i <= currentStepIndex
                          ? "text-emerald-400"
                          : "text-zinc-600"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  {i < STATUSES.length - 1 && (
                    <div
                      className={`mb-4 h-px flex-1 ${
                        i < currentStepIndex ? "bg-emerald-400" : "bg-zinc-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Items */}
            <div className="mb-4 flex flex-col gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-sm border border-zinc-800 bg-zinc-950 p-2.5"
                >
                  <div>
                    <p className="text-sm text-zinc-100">{item.product_name}</p>
                    <p className="font-mono text-xs text-zinc-500">
                      ${Number(item.price).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-zinc-100">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-4 flex items-center justify-between border-t border-zinc-800 pt-3">
              <span className="font-mono text-xs text-zinc-500">Total</span>
              <span className="font-mono text-base font-semibold text-zinc-50">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>

            <div className="rounded-sm border border-zinc-800 bg-zinc-950 p-3">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                Shipping To
              </p>
              <p className="text-sm text-zinc-100">{order.shipping_name}</p>
              <p className="text-sm text-zinc-400">
                {order.shipping_address}, {order.shipping_city}
              </p>
              <p className="text-sm text-zinc-400">{order.shipping_phone}</p>
              <p className="mt-2 font-mono text-[10px] uppercase text-zinc-500">
                Payment:{" "}
                {order.payment_method === "cod"
                  ? "Cash on Delivery"
                  : order.payment_method}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderDetailModal;
