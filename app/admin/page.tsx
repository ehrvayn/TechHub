import DashboardHeader from "@/components/admin/DashboardHeader";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import InsightsPanel from "@/components/admin/InsightsPanel";
import {
  getAdminStats,
  listAllOrders,
  getRevenueTrend,
} from "@/lib/services/orderService";

export default async function AdminDashboard() {
  const statsResult = await getAdminStats();
  const ordersResult = await listAllOrders();
  const trendResult = await getRevenueTrend();

  const stats =
    statsResult.success && statsResult.stats
      ? statsResult.stats
      : { order_count: 0, revenue: 0, pending_count: 0 };

  const allOrders =
    ordersResult.success && ordersResult.orders ? ordersResult.orders : [];
  const trend =
    trendResult.success && trendResult.trend ? trendResult.trend : [];

  const recentOrders = allOrders.slice(0, 6);
  const avgOrderValue =
    stats.order_count > 0 ? Number(stats.revenue || 0) / stats.order_count : 0;

  const statusCounts = allOrders.reduce<Record<string, number>>(
    (acc, o: any) => {
      const key = o.status?.toLowerCase() || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );
  const statusEntries = Object.entries(statusCounts).sort(
    (a, b) => b[1] - a[1],
  );
  const maxStatusCount = Math.max(1, ...statusEntries.map(([, c]) => c));

  const spendByCustomer = allOrders.reduce<Record<string, number>>(
    (acc, o: any) => {
      const name = o.shipping_name || "Guest customer";
      acc[name] = (acc[name] || 0) + Number(o.total || 0);
      return acc;
    },
    {},
  );
  const topCustomers = Object.entries(spendByCustomer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex flex-col space-y-10">
      <h1 className="font-mono text-lg uppercase tracking-widest text-zinc-300">
        Store overview
      </h1>

      <DashboardHeader
        revenue={Number(stats.revenue || 0)}
        orderCount={stats.order_count}
        avgOrderValue={avgOrderValue}
        pendingCount={stats.pending_count}
        trend={trend}
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RecentOrdersTable orders={recentOrders} />
        </div>
        <div className="col-span-1">
          <InsightsPanel
            statusEntries={statusEntries}
            maxCount={maxStatusCount}
            customers={topCustomers}
          />
        </div>
      </div>
    </div>
  );
}
