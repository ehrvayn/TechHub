type DashboardHeaderProps = {
  revenue: number;
  orderCount: number;
  avgOrderValue: number;
  pendingCount: number;
  trend: { day: string; revenue: number | string }[];
};

export default function DashboardHeader({
  revenue,
  orderCount,
  avgOrderValue,
  pendingCount,
  trend,
}: DashboardHeaderProps) {
  const money = (n: number, decimals = 0) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const values = trend.map((d) => Number(d.revenue));
  const max = Math.max(...values, 1);
  const needsReview = pendingCount > 0;

  return (
    <div className="overflow-hidden rounded-[4] border border-[#2A2F34] bg-[#15181B]">
      <div className="flex items-stretch divide-x divide-[#2A2F34]">
        <div className="flex-1 p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#6B7278]">
            Revenue <span className="text-sm">|</span> 14d
          </p>
          <p className="mt-1 font-mono text-4xl font-bold tabular-nums text-[#F2F0EB]">
            ${money(revenue, 2)}
          </p>
          <div className="mt-4 flex h-8 items-end gap-1">
            {trend.map((d, i) => {
              const heightPct = Math.max(
                (Number(d.revenue) / max) * 100,
                Number(d.revenue) > 0 ? 10 : 4,
              );
              const isLast = i === trend.length - 1;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-[1px] ${isLast ? "bg-[#C88A5A]" : "bg-[#2A2F34]"}`}
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex w-36 flex-col justify-center gap-4 p-5">
          <div className="flex flex-col gap-1">
            <p
              className={`font-mono text-[10px] uppercase tracking-widest ${
                needsReview ? "text-[#D1A053]" : "text-[#6B7278]"
              }`}
            >
              Unreviewed Orders
            </p>
            <p
              className={`font-mono text-xl font-semibold tabular-nums ${
                needsReview ? "text-[#D1A053]" : "text-[#F2F0EB]"
              }`}
            >
              {pendingCount}
            </p>
          </div>
          <div className="flex flex-col gap-1 border-t border-[#2A2F34] pt-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B7278]">
              Avg. Value
            </p>
            <p className="font-mono text-xl font-semibold tabular-nums text-[#F2F0EB]">
              ${money(avgOrderValue)}
            </p>
          </div>
        </div>
        <div className={`flex w-36 flex-col justify-center gap-1 p-5 `}>
          <p className="font-mono flex justify-center text-[13px] uppercase tracking-widest text-[#6B7278]">
            Orders
          </p>
          <p className="font-mono flex justify-center text-xl font-semibold tabular-nums text-[#F2F0EB]">
            {orderCount}
          </p>
        </div>
      </div>
    </div>
  );
}
