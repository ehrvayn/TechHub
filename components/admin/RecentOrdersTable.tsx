import Link from "next/link";
import { ArrowRight } from "lucide-react";

type DashboardOrder = {
  id: number;
  shipping_name: string;
  total?: number | string;
  status: string;
  payment_method?: string;
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-[#D1A053]/10 text-[#D1A053] ring-1 ring-[#D1A053]/30",
  paid: "bg-[#7A9CC6]/10 text-[#7A9CC6] ring-1 ring-[#7A9CC6]/30",
  preparing: "bg-[#B08FC7]/10 text-[#B08FC7] ring-1 ring-[#B08FC7]/30",
  shipped: "bg-[#6FA8C9]/10 text-[#6FA8C9] ring-1 ring-[#6FA8C9]/30",
  delivered: "bg-[#8FAE8B]/10 text-[#8FAE8B] ring-1 ring-[#8FAE8B]/30",
  cancelled: "bg-[#C97066]/10 text-[#C97066] ring-1 ring-[#C97066]/30",
  "out for delivery": "bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-500/30",
};

export default function RecentOrdersTable({
  orders,
}: {
  orders: DashboardOrder[];
}) {
  const money = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="overflow-hidden rounded-[4] border border-[#2A2F34] bg-[#15181B]">
      <div className="flex items-center justify-between border-b border-[#2A2F34] px-4 py-3">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-[#6B7278]">
          Recent Orders
        </h2>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 font-mono text-xs text-[#C88A5A] transition-colors hover:text-[#DDA173]"
        >
          View all
          <ArrowRight size={12} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="py-12 text-center text-sm text-[#6B7278]">
          No orders yet.
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 border-b border-[#2A2F34] bg-[#1B1F23] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#6B7278]">
            <span className="w-14">Order</span>
            <span className="flex-1">Customer</span>
            <span className="w-24">Payment</span>
            <span className="w-20 text-right">Amount</span>
            <span className="w-32 text-right">Status</span>
          </div>
          <div className="divide-y divide-[#2A2F34]">
            {orders.map((order) => {
              const status = order.status?.toLowerCase() ?? "";
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#1B1F23]"
                >
                  <span className="w-14 font-mono text-xs tabular-nums text-[#6B7278]">
                    #{String(order.id).padStart(4, "0")}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium text-[#F2F0EB]">
                    {order.shipping_name || "Guest customer"}
                  </span>
                  <span className="w-24 font-mono text-xs uppercase text-[#6B7278]">
                    {order.payment_method === "cod"
                      ? "COD"
                      : order.payment_method || "—"}
                  </span>
                  <span className="w-20 text-right font-mono text-sm font-semibold tabular-nums text-[#F2F0EB]">
                    {order.total !== undefined
                      ? `$${money(Number(order.total))}`
                      : "—"}
                  </span>
                  <span className="flex w-32 justify-end">
                    <span
                      className={`inline-flex items-center justify-center text-center whitespace-nowrap rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${
                        STATUS_STYLE[status] ?? "bg-[#2A2F34] text-[#8B9198]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
