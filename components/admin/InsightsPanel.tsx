"use client";

import { useDarkMode } from "@/context/DarkModeContext";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-[#D1A053]",
  paid: "bg-[#7A9CC6]",
  preparing: "bg-[#B08FC7]",
  shipped: "bg-[#6FA8C9]",
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
  const { isDarkMode } = useDarkMode();

  const money = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div
      className={`overflow-hidden rounded-[4] border ${
        isDarkMode
          ? "border-[#2A2F34] bg-[#15181B]"
          : "border-zinc-200 bg-white"
      }`}
    >
      <div
        className={`border-b px-4 py-3 ${
          isDarkMode ? "border-[#2A2F34]" : "border-zinc-200"
        }`}
      >
        <h3
          className={`font-mono text-[11px] uppercase tracking-widest ${
            isDarkMode ? "text-[#6B7278]" : "text-zinc-500"
          }`}
        >
          By Status
        </h3>
      </div>
      <div className="p-4">
        {statusEntries.length === 0 ? (
          <p
            className={`text-sm ${
              isDarkMode ? "text-[#6B7278]" : "text-zinc-500"
            }`}
          >
            No orders yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {statusEntries.map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span
                  className={`w-20 shrink-0 font-mono text-xs capitalize ${
                    isDarkMode ? "text-[#9CA3A8]" : "text-zinc-600"
                  }`}
                >
                  {status}
                </span>
                <div
                  className={`h-1.5 flex-1 overflow-hidden rounded-full ${
                    isDarkMode ? "bg-[#2A2F34]" : "bg-zinc-200"
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${
                      STATUS_COLOR[status] ?? "bg-[#6B7278]"
                    }`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span
                  className={`w-5 shrink-0 text-right font-mono text-xs tabular-nums ${
                    isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
                  }`}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className={`border-y px-4 py-3 ${
          isDarkMode ? "border-[#2A2F34]" : "border-zinc-200"
        }`}
      >
        <h3
          className={`font-mono text-[11px] uppercase tracking-widest ${
            isDarkMode ? "text-[#6B7278]" : "text-zinc-500"
          }`}
        >
          Top Customers
        </h3>
      </div>
      <div className="p-4">
        {customers.length === 0 ? (
          <p
            className={`text-sm ${
              isDarkMode ? "text-[#6B7278]" : "text-zinc-500"
            }`}
          >
            No customers yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {customers.map(([name, total], i) => (
              <div key={name} className="flex items-center gap-3">
                <span
                  className={`w-4 shrink-0 font-mono text-xs tabular-nums ${
                    isDarkMode ? "text-[#565C63]" : "text-zinc-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`flex-1 truncate text-sm ${
                    isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
                  }`}
                >
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
