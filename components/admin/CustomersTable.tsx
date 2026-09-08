"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import CustomerDetailModal from "@/components/modals/CustomerDetailModal";

type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  order_count: number;
  total_spent: number;
};

export default function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.customers ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2
          size={20}
          className="animate-spin text-zinc-400 dark:text-zinc-600"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-zinc-200 bg-white dark:border-[#2A2F34] dark:bg-[#15181B]">
      <div className="hidden items-center gap-4 border-b border-zinc-200 bg-zinc-50 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500 sm:flex dark:border-[#2A2F34] dark:bg-[#1B1F23] dark:text-[#6B7278]">
        <span className="w-8" />
        <span className="flex-1">Name</span>
        <span className="w-48">Email</span>
        <span className="w-16 text-right">Orders</span>
        <span className="w-24 text-right">Spent</span>
      </div>
      <div className="divide-y divide-zinc-200 dark:divide-[#2A2F34]">
        {customers.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className="flex cursor-pointer items-center gap-3 px-3 py-3 transition-colors hover:bg-zinc-50 sm:gap-4 sm:px-4 dark:hover:bg-[#1B1F23]"
          >
            {c.avatar_url ? (
              <img
                src={c.avatar_url}
                alt=""
                referrerPolicy="no-referrer"
                className="h-6 w-6 shrink-0 rounded-full"
              />
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-mono text-[9px] text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                {c.first_name?.[0]}
                {c.last_name?.[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm text-zinc-900 dark:text-zinc-100">
                {c.first_name} {c.last_name}
                {c.role === "admin" && (
                  <span className="ml-1.5 rounded-sm bg-zinc-200 px-1 py-0.5 font-mono text-[9px] uppercase text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500">
                    admin
                  </span>
                )}
              </span>
              <span className="block truncate font-mono text-[10px] text-zinc-500 sm:hidden">
                {c.email} · {c.order_count} orders · $
                {Number(c.total_spent).toFixed(2)}
              </span>
            </div>
            <span className="hidden w-48 truncate font-mono text-xs text-zinc-500 sm:block">
              {c.email}
            </span>
            <span className="hidden w-16 text-right font-mono text-sm text-zinc-900 sm:block dark:text-zinc-100">
              {c.order_count}
            </span>
            <span className="hidden w-24 text-right font-mono text-sm font-semibold text-emerald-600 sm:block dark:text-emerald-400">
              ${Number(c.total_spent).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {selectedId && (
        <CustomerDetailModal
          customerId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
