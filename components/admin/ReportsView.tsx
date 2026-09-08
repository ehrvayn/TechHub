"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type BestSeller = { product_name: string; units_sold: number; revenue: number };
type CategoryRevenue = { category: string; revenue: number };
type MonthlyRevenue = { month: string; revenue: number };

type Pt = { x: number; y: number };

function monotonePath(pts: Pt[]) {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M ${pts[0].x} ${pts[0].y}`;

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1].x - pts[i].x;
    slope[i] = dx[i] === 0 ? 0 : (pts[i + 1].y - pts[i].y) / dx[i];
  }

  const tangent = new Array(n).fill(0);
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    tangent[i] =
      slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }

  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      tangent[i] = t * a * slope[i];
      tangent[i + 1] = t * b * slope[i];
    }
  }

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cp1x = p0.x + dx[i] / 3;
    const cp1y = p0.y + (tangent[i] * dx[i]) / 3;
    const cp2x = p1.x - dx[i] / 3;
    const cp2y = p1.y - (tangent[i + 1] * dx[i]) / 3;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

// Builds a real 6-calendar-month window ending at the current month,
// zero-filling any month missing from the API response — mirrors the
// buildWeek() approach used for the 7-day header chart.
function buildSixMonths(byMonth: Map<string, number>) {
  const months: { key: string; label: string; revenue: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString(undefined, { month: "short" });
    months.push({ key, label, revenue: byMonth.get(key) ?? 0 });
  }
  return months;
}

export default function ReportsView() {
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [byCategory, setByCategory] = useState<CategoryRevenue[]>([]);
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((res) => res.json())
      .then((data) => {
        setBestSellers(data.bestSellers ?? []);
        setByCategory(data.byCategory ?? []);
        setMonthly(data.monthly ?? []);
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

  const maxCategoryRevenue = Math.max(
    ...byCategory.map((c) => Number(c.revenue)),
    1,
  );

  const totalRevenue = byCategory.reduce(
    (sum, c) => sum + Number(c.revenue),
    0,
  );

  const monthlyMap = new Map(
    monthly
      .map((m): [string, number] | null => {
        const match = String(m.month).match(/^(\d{4})-(\d{2})/);
        return match ? [`${match[1]}-${match[2]}`, Number(m.revenue)] : null;
      })
      .filter((x): x is [string, number] => x !== null),
  );

  const sixMonths = buildSixMonths(monthlyMap);
  const hasAnyMonthlyData = monthlyMap.size > 0;
  const monthlyTotal = sixMonths.reduce((s, m) => s + m.revenue, 0);
  const maxMonthlyRevenue = Math.max(...sixMonths.map((m) => m.revenue), 1);

  const chartWidth = 640;
  const chartHeight = 130;
  const paddingTop = 14;
  const paddingBottom = 22;
  const paddingLeft = 30;
  const usableWidth = chartWidth - paddingLeft;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const monthlyPts: Pt[] = sixMonths.map((m, i) => ({
    x: paddingLeft + (i / (sixMonths.length - 1)) * usableWidth,
    y:
      paddingTop +
      usableHeight -
      (m.revenue / maxMonthlyRevenue) * usableHeight,
  }));

  const monthlyPath = monotonePath(monthlyPts);
  const monthlyArea = `${monthlyPath} L ${chartWidth} ${chartHeight - paddingBottom} L ${paddingLeft} ${chartHeight - paddingBottom} Z`;

  const useK = maxMonthlyRevenue >= 1000;
  const formatAxis = (val: number) =>
    useK ? `$${(val / 1000).toFixed(1)}k` : `$${Math.round(val)}`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      <div className="col-span-1 px-1 sm:col-span-2 sm:px-5">
        <p className="text-[13px] font-mono text-zinc-500 dark:text-[#8B9198]">
          Total Revenue
        </p>
        <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-zinc-900 dark:text-[#F2F0EB]">
          $
          {totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="rounded-sm border border-zinc-200 bg-white dark:border-[#2A2F34] dark:bg-[#15181B]">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-[#2A2F34]">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 dark:text-[#6B7278]">
            Best Sellers
          </h3>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-[#2A2F34]">
          {bestSellers.length === 0 ? (
            <p className="px-4 py-6 font-mono text-xs text-zinc-400 dark:text-zinc-600">
              No sales yet.
            </p>
          ) : (
            bestSellers.map((item, i) => (
              <div
                key={item.product_name}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span className="w-4 font-mono text-xs text-zinc-400 dark:text-zinc-600">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-sm text-zinc-900 dark:text-zinc-100">
                  {item.product_name}
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  {item.units_sold} sold
                </span>
                <span className="w-20 text-right font-mono text-sm text-emerald-600 dark:text-emerald-400">
                  ${Number(item.revenue).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-sm border border-zinc-200 bg-white dark:border-[#2A2F34] dark:bg-[#15181B]">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-[#2A2F34]">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 dark:text-[#6B7278]">
            Revenue by Category
          </h3>
        </div>
        <div className="flex flex-col gap-2.5 p-4">
          {byCategory.length === 0 ? (
            <p className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
              No sales yet.
            </p>
          ) : (
            byCategory.map((c) => (
              <div key={c.category ?? "uncategorized"}>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {c.category ?? "Uncategorized"}
                  </span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100">
                    ${Number(c.revenue).toFixed(2)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-600 dark:bg-emerald-400"
                    style={{
                      width: `${(Number(c.revenue) / maxCategoryRevenue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="col-span-1 rounded-lg border border-zinc-200 bg-white sm:col-span-2 dark:border-[#2A2F34] dark:bg-[#15181B]">
        <div className="p-5">
          <div className="flex border-b pb-2 px-5 -mx-5 border-zinc-400/30 flex-col">
            <p className="text-[13px] font-mono text-zinc-500 dark:text-[#8B9198]">
              Revenue last 6 months
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-zinc-900 dark:text-[#F2F0EB]">
              $
              {monthlyTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {!hasAnyMonthlyData ? (
            <div className="mt-4 flex h-32 items-center justify-center text-sm text-zinc-400 dark:text-[#6B7278]">
              No sales recorded yet.
            </div>
          ) : (
            <div className="relative mt-4 h-60 w-full">
              <svg
                className="h-full w-full overflow-visible"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="monthly-revenue-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#C88A5A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#C88A5A" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[0, 0.5, 1].map((ratio, idx) => {
                  const yPos = paddingTop + usableHeight * ratio;
                  const val = maxMonthlyRevenue * (1 - ratio);
                  return (
                    <g key={idx}>
                      <line
                        x1="0"
                        y1={yPos}
                        x2={chartWidth}
                        y2={yPos}
                        className="stroke-zinc-200 dark:stroke-[#2A2F34]"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                      <text
                        x="0"
                        y={yPos - 4}
                        className="fill-zinc-400 dark:fill-[#6B7278]"
                        style={{ fontSize: "9px" }}
                      >
                        {formatAxis(val)}
                      </text>
                    </g>
                  );
                })}

                <path d={monthlyArea} fill="url(#monthly-revenue-fill)" />

                <path
                  d={monthlyPath}
                  fill="none"
                  stroke="#C88A5A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {monthlyPts.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="3"
                    className="fill-[#C88A5A]"
                  />
                ))}
              </svg>

              <div
                className="absolute -bottom-4 flex w-full justify-between text-[10px] text-zinc-400 dark:text-[#6B7278]"
                style={{ paddingLeft }}
              >
                {sixMonths.map((m) => (
                  <span key={m.key}>{m.label}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
