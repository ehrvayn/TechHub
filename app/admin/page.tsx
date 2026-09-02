import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAdminStats, listAllOrders } from "@/lib/services/orderService";

type DashboardOrder = {
  id: number;
  shipping_name: string;
  total_price?: number | string;
  status: string;
  created_at?: string;
};

const money = (n: number) =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-[#D1A053]",
  completed: "bg-[#8FAE8B]",
  delivered: "bg-[#8FAE8B]",
  cancelled: "bg-[#C97066]",
};

export default async function AdminDashboard() {
  const statsResult = await getAdminStats();
  const ordersResult = await listAllOrders();

  const stats =
    statsResult.success && statsResult.stats
      ? statsResult.stats
      : { order_count: 0, revenue: 0, pending_count: 0 };

  const allOrders: DashboardOrder[] =
    ordersResult.success && ordersResult.orders ? ordersResult.orders : [];

  const recentOrders = allOrders.slice(0, 6);
  const needsReview = stats.pending_count > 0;
  const avgOrderValue =
    stats.order_count > 0 ? Number(stats.revenue || 0) / stats.order_count : 0;

  const statusCounts = allOrders.reduce<Record<string, number>>((acc, o) => {
    const key = o.status?.toLowerCase() || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const statusEntries = Object.entries(statusCounts).sort(
    (a, b) => b[1] - a[1],
  );
  const maxStatusCount = Math.max(1, ...statusEntries.map(([, c]) => c));

  const spendByCustomer = allOrders.reduce<Record<string, number>>((acc, o) => {
    const name = o.shipping_name || "Guest customer";
    acc[name] = (acc[name] || 0) + Number(o.total_price || 0);
    return acc;
  }, {});
  const topCustomers = Object.entries(spendByCustomer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex flex-col space-between space-y-10">
      <div>
        <h1 className="font-mono text-lg uppercase tracking-widest text-zinc-300">
          Store overview
        </h1>
      </div>

      <div className="grid grid-cols-4 divide-x divide-[#2A2F34] overflow-hidden rounded-[4] border border-[#2A2F34] bg-zinc-900/60">
        <div className="px-6 py-6">
          <p className="text-sm text-[#8B9198]">Orders</p>
          <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-[#F2F0EB]">
            {stats.order_count}
          </p>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm text-[#8B9198]">Revenue</p>
          <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-[#C88A5A]">
            ${money(Number(stats.revenue || 0))}
          </p>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm text-[#8B9198]">Avg. order value</p>
          <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-[#F2F0EB]">
            ${money(avgOrderValue)}
          </p>
        </div>
        <div className={`px-6 py-6 ${needsReview ? "bg-[#D1A053]/8" : ""}`}>
          <p className="text-sm text-[#8B9198]">Needs review</p>
          <p
            className={`mt-2 font-mono text-3xl font-semibold tabular-nums ${
              needsReview ? "text-[#D1A053]" : "text-[#F2F0EB]"
            }`}
          >
            {stats.pending_count}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-sm font-medium text-[#F2F0EB]">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm text-[#C88A5A] hover:text-[#DDA173] transition-colors"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-lg border border-[#2A2F34] bg-zinc-900/60 py-10 text-center text-sm text-[#8B9198]">
              No orders yet — new orders will appear here as customers check
              out.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[4] border border-[#2A2F34] bg-zinc-900/50">
              <div className="flex items-center gap-4 border-b border-[#2A2F34] bg-zinc-900 px-4 py-2.5 text-xs text-[#8B9198]">
                <span className="w-14 font-mono">Order</span>
                <span className="flex-1">Customer</span>
                <span className="w-24 text-right">Amount</span>
                <span className="w-28 text-right">Status</span>
              </div>
              <div className="divide-y divide-[#2A2F34]">
                {recentOrders.map((order) => {
                  const status = order.status?.toLowerCase() ?? "";
                  return (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 px-4 py-3.5 hover:bg-[#20252A] transition-colors"
                    >
                      <span className="w-14 font-mono text-xs tabular-nums text-[#6B7278]">
                        {String(order.id).padStart(4, "0")}
                      </span>
                      <span className="flex-1 text-sm font-medium text-[#F2F0EB]">
                        {order.shipping_name || "Guest customer"}
                      </span>
                      {order.total_price !== undefined ? (
                        <span className="w-24 text-right font-mono text-sm tabular-nums text-[#F2F0EB]">
                          ${money(Number(order.total_price))}
                        </span>
                      ) : (
                        <span className="w-24" />
                      )}
                      <span className="flex w-28 items-center justify-end gap-2 text-sm text-[#9CA3A8]">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            STATUS_COLOR[status] ?? "bg-[#6B7278]"
                          }`}
                        />
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1 space-y-6">
          <div className="rounded-[4] border border-[#2A2F34] bg-[#1B1F23] p-5">
            <h3 className="text-sm font-medium text-[#F2F0EB]">By status</h3>
            {statusEntries.length === 0 ? (
              <p className="mt-3 text-sm text-[#6B7278]">No data yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {statusEntries.map(([status, count]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize text-[#9CA3A8]">
                        {status}
                      </span>
                      <span className="font-mono tabular-nums text-[#F2F0EB]">
                        {count}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#2A2F34]">
                      <div
                        className={`h-full rounded-full ${
                          STATUS_COLOR[status] ?? "bg-[#6B7278]"
                        }`}
                        style={{ width: `${(count / maxStatusCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[4z   ] border border-[#2A2F34] bg-[#1B1F23] p-5">
            <h3 className="text-sm font-medium text-[#F2F0EB]">
              Top customers
            </h3>
            {topCustomers.length === 0 ? (
              <p className="mt-3 text-sm text-[#6B7278]">No data yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {topCustomers.map(([name, total]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="truncate pr-3 text-sm text-[#F2F0EB]">
                      {name}
                    </span>
                    <span className="shrink-0 font-mono text-sm tabular-nums text-[#8B9198]">
                      ${money(total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
