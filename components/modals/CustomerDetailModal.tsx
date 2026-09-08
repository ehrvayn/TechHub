"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

type Customer = {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
};

type Order = {
  id: number;
  status: string;
  total: number;
  payment_method: string;
  created_at: string;
};

export default function CustomerDetailModal({
  customerId,
  onClose,
}: {
  customerId: number;
  onClose: () => void;
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useBodyScrollLock(true);

  useEffect(() => {
    fetch(`/api/admin/customers/${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data.customer);
        setOrders(data.orders ?? []);
        setLoading(false);
      });
  }, [customerId]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 dark:bg-black/70 sm:px-4"
      onClick={onClose}
    >
      <div
        className="h-full max-h-full w-full max-w-none overflow-y-auto border-0 bg-white dark:bg-zinc-900 sm:h-auto sm:max-h-[80vh] sm:max-w-md sm:rounded-md sm:border sm:border-zinc-200 dark:sm:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Customer
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        </div>

        {loading || !customer ? (
          <div className="flex justify-center py-12">
            <Loader2
              size={18}
              className="animate-spin text-zinc-400 dark:text-zinc-600"
            />
          </div>
        ) : (
          <div className="p-4">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {customer.first_name} {customer.last_name}
            </p>
            <p className="font-mono text-xs text-zinc-500">{customer.email}</p>
            <p className="mt-1 font-mono text-[10px] text-zinc-400 dark:text-zinc-600">
              Joined {new Date(customer.created_at).toLocaleDateString()}
            </p>

            <p className="mb-2 mt-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Order History
            </p>
            <div className="flex flex-col gap-2">
              {orders.length === 0 ? (
                <p className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
                  No orders yet.
                </p>
              ) : (
                orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between rounded-sm border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      #{o.id}
                    </span>
                    <span className="font-mono text-xs uppercase text-zinc-500">
                      {o.status}
                    </span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                      ${Number(o.total).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
