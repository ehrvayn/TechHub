"use client";

import { useEffect, useState } from "react";
import { useDarkMode } from "@/context/DarkModeContext";

type DashboardHeaderProps = {
  revenue: number;
  orderCount: number;
  avgOrderValue: number;
  pendingCount: number;
  trend: { day: string; revenue: number | string }[];
  todayKey: string;
};

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

export default function DashboardHeader({
  revenue,
  orderCount,
  avgOrderValue,
  pendingCount,
  trend,
  todayKey,
}: DashboardHeaderProps) {
  const { isDarkMode } = useDarkMode();

  const [unreviewedCount, setUnreviewedCount] = useState<number | null>(null);
  const [unreviewedError, setUnreviewedError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/reviews/unreviewed-count")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const count = Number(data?.count);
        if (data?.success && Number.isFinite(count)) {
          setUnreviewedCount(count);
        } else {
          setUnreviewedError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setUnreviewedError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const money = (n: number, decimals = 0) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const toDateKey = (d: Date) => d.toISOString().slice(0, 10);

  const buildWeek = (endDateKey: string, byDate: Map<string, number>) => {
    const days: { day: string; date: Date; revenue: number }[] = [];
    const endDate = new Date(`${endDateKey}T00:00:00Z`);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(endDate);
      d.setUTCDate(d.getUTCDate() - i);
      const key = toDateKey(d);
      days.push({ day: key, date: d, revenue: byDate.get(key) ?? 0 });
    }
    return days;
  };

  const trendMap = new Map(
    trend
      .map((t) => {
        const d = new Date(t.day);
        return isNaN(d.getTime())
          ? null
          : ([toDateKey(d), Number(t.revenue)] as const);
      })
      .filter((x): x is readonly [string, number] => x !== null),
  );

  const lastWeekEnd = new Date(`${todayKey}T00:00:00Z`);
  lastWeekEnd.setUTCDate(lastWeekEnd.getUTCDate() - 7);
  const lastWeekEndKey = toDateKey(lastWeekEnd);

  const thisWeek = buildWeek(todayKey, trendMap);
  const lastWeek = buildWeek(lastWeekEndKey, trendMap);

  const hasAnyTrendData = trendMap.size > 0;
  const lastWeekHasData = lastWeek.some((d) => d.revenue > 0);

  const thisWeekTotal = thisWeek.reduce((s, d) => s + d.revenue, 0);
  const lastWeekTotal = lastWeek.reduce((s, d) => s + d.revenue, 0);
  const pctChange =
    lastWeekTotal > 0
      ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100
      : null;

  const needsReview = (unreviewedCount ?? 0) > 0;

  const chartWidth = 560;
  const chartHeight = 130;
  const paddingTop = 14;
  const paddingBottom = 22;
  const paddingLeft = 30;
  const usableWidth = chartWidth - paddingLeft;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const max = Math.max(
    ...thisWeek.map((d) => d.revenue),
    ...(lastWeekHasData ? lastWeek.map((d) => d.revenue) : []),
    1,
  );

  const toPoints = (series: { revenue: number }[]): Pt[] =>
    series.map((d, i) => ({
      x: paddingLeft + (i / (series.length - 1)) * usableWidth,
      y: paddingTop + usableHeight - (d.revenue / max) * usableHeight,
    }));

  const thisWeekPts = toPoints(thisWeek);
  const lastWeekPts = toPoints(lastWeek);
  const thisWeekPath = monotonePath(thisWeekPts);
  const lastWeekPath = monotonePath(lastWeekPts);
  const areaPath = `${thisWeekPath} L ${chartWidth} ${chartHeight - paddingBottom} L ${paddingLeft} ${chartHeight - paddingBottom} Z`;
  const lastPt = thisWeekPts[thisWeekPts.length - 1];

  const useK = max >= 1000;
  const formatAxis = (val: number) =>
    useK ? `$${(val / 1000).toFixed(1)}k` : `$${Math.round(val)}`;

  const border = isDarkMode ? "border-[#2A2F34]" : "border-zinc-200";
  const surface = isDarkMode ? "bg-[#15181B]" : "bg-white";
  const textPrimary = isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900";
  const textMuted = isDarkMode ? "text-[#8B9198]" : "text-zinc-500";
  const textFaint = isDarkMode ? "text-[#6B7278]" : "text-zinc-400";
  const divide = isDarkMode ? "divide-[#2A2F34]" : "divide-zinc-200";

  const unreviewedDisplay =
    unreviewedError ||
    (unreviewedCount !== null && !Number.isFinite(unreviewedCount))
      ? "—"
      : unreviewedCount === null
        ? "…"
        : unreviewedCount;

  return (
    <div className={`overflow-hidden rounded-[5] border ${border} ${surface}`}>
      <div
        className={`flex flex-col divide-y ${divide} lg:flex-row lg:items-stretch lg:divide-x lg:divide-y-0`}
      >
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="border-b pb-2 px-5 -mx-5 border-zinc-400/30">
            <div className="flex items-center justify-between">
              <p className={`text-sm ${textMuted}`}>Revenue last 7 days</p>
              {pctChange !== null && (
                <span
                  className={`text-xs font-medium ${
                    pctChange >= 0 ? "text-[#8FAE8B]" : "text-[#C97066]"
                  }`}
                >
                  {pctChange >= 0 ? "+" : ""}
                  {pctChange.toFixed(0)}% vs last week
                </span>
              )}
            </div>

            <p
              className={`mt-1 font-mono text-3xl font-semibold tabular-nums ${textPrimary}`}
            >
              ${money(thisWeekTotal, 2)}
            </p>
          </div>

          {lastWeekHasData && (
            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C88A5A]" />
                <span className={textMuted}>This week</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    isDarkMode ? "bg-[#6B7278]" : "bg-zinc-300"
                  }`}
                />
                <span className={textMuted}>Last week</span>
              </span>
            </div>
          )}

          {hasAnyTrendData ? (
            <div className="relative mt-4 h-32 w-full">
              <svg
                className="h-full w-full overflow-visible"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C88A5A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#C88A5A" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[0, 0.5, 1].map((ratio, idx) => {
                  const yPos = paddingTop + usableHeight * ratio;
                  const val = max * (1 - ratio);
                  return (
                    <g key={idx}>
                      <line
                        x1="0"
                        y1={yPos}
                        x2={chartWidth}
                        y2={yPos}
                        stroke={isDarkMode ? "#2A2F34" : "#E4E4E7"}
                        strokeDasharray="3 3"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                      <text
                        x="0"
                        y={yPos - 4}
                        fill={isDarkMode ? "#6B7278" : "#A1A1AA"}
                        style={{ fontSize: "9px" }}
                      >
                        {formatAxis(val)}
                      </text>
                    </g>
                  );
                })}

                <path d={areaPath} fill="url(#revenue-fill)" />

                {lastWeekHasData && (
                  <path
                    d={lastWeekPath}
                    fill="none"
                    stroke={isDarkMode ? "#4A5157" : "#D4D4D8"}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                )}

                <path
                  d={thisWeekPath}
                  fill="none"
                  stroke="#C88A5A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {lastPt && (
                  <circle
                    cx={lastPt.x}
                    cy={lastPt.y}
                    r="3.5"
                    className="fill-[#C88A5A]"
                  />
                )}
              </svg>

              <div
                className={`absolute -bottom-4 flex w-full justify-between text-[10px] ${textFaint}`}
                style={{ paddingLeft }}
              >
                {thisWeek.map((d, i) => (
                  <span key={i}>
                    {d.date.toLocaleDateString("en-US", {
                      weekday: "short",
                      timeZone: "UTC",
                    })}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`mt-4 flex h-32 items-center justify-center text-sm ${textFaint}`}
            >
              No revenue recorded yet this week.
            </div>
          )}
        </div>

        <div className="flex w-full flex-row gap-6 p-4 sm:p-5 lg:w-40 lg:flex-col lg:justify-center lg:gap-4">
          <div>
            <p
              className={`text-xs ${needsReview ? "text-[#D1A053]" : textMuted}`}
            >
              Unreviewed items
            </p>
            <p
              className={`mt-1 font-mono text-xl font-semibold tabular-nums ${
                needsReview ? "text-[#D1A053]" : textPrimary
              }`}
            >
              {unreviewedDisplay}
            </p>
          </div>
          <div className={`border-t pt-4 ${border}`}>
            <p className={`text-xs ${textMuted}`}>Avg. order value</p>
            <p
              className={`mt-1 font-mono text-xl font-semibold tabular-nums ${textPrimary}`}
            >
              ${money(avgOrderValue)}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-row items-center justify-between gap-3 p-4 text-left sm:p-5 lg:w-28 lg:flex-col lg:justify-center lg:gap-1 lg:text-center">
          <p className={`text-xs ${textMuted}`}>Total orders</p>
          <p
            className={`font-mono text-xl font-semibold tabular-nums ${textPrimary}`}
          >
            {orderCount}
          </p>
        </div>
      </div>
    </div>
  );
}
