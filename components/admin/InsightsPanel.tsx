const STATUS_COLOR: Record<string, string> = {
  pending: "bg-[#D1A053]",
  paid: "bg-[#7A9CC6]",
  preparing: "bg-[#B08FC7]",
  shipped: "bg-[#6FA8C9]",
  completed: "bg-[#8FAE8B]",
  delivered: "bg-[#8FAE8B]",
  cancelled: "bg-[#C97066]",
};

type InsightsPanelProps = {
  statusEntries: [string, number][];
  maxCount: number;
  customers: [string, number][];
};

export default function InsightsPanel({
  statusEntries,
  maxCount,
  customers,
}: InsightsPanelProps) {
  const money = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="overflow-hidden rounded-[4] border border-[#2A2F34] bg-[#15181B]">
      <div className="border-b border-[#2A2F34] px-4 py-3">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#6B7278]">
          By Status
        </h3>
      </div>
      <div className="p-4">
        {statusEntries.length === 0 ? (
          <p className="text-sm text-[#6B7278]">No orders yet.</p>
        ) : (
          <div className="space-y-2.5">
            {statusEntries.map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="w-20 shrink-0 font-mono text-xs capitalize text-[#9CA3A8]">
                  {status}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2A2F34]">
                  <div
                    className={`h-full rounded-full ${STATUS_COLOR[status] ?? "bg-[#6B7278]"}`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-5 shrink-0 text-right font-mono text-xs tabular-nums text-[#F2F0EB]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-y border-[#2A2F34] px-4 py-3">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#6B7278]">
          Top Customers
        </h3>
      </div>
      <div className="p-4">
        {customers.length === 0 ? (
          <p className="text-sm text-[#6B7278]">No customers yet.</p>
        ) : (
          <div className="space-y-2.5">
            {customers.map(([name, total], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-4 shrink-0 font-mono text-xs tabular-nums text-[#565C63]">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-sm text-[#F2F0EB]">
                  {name}
                </span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-[#C88A5A]">
                  ${money(total)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
