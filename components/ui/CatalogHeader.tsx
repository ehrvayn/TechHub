"use client";

import { ArrowUpDown } from "lucide-react";

type CatalogHeaderProps = {
  totalItems: number;
  sortBy: string;
  onSortChange: (value: string) => void;
};

export function CatalogHeader({
  totalItems,
  sortBy,
  onSortChange,
}: CatalogHeaderProps) {
  return (
    <div
      id="catalog"
      className="mb-6 flex flex-wrap items-center justify-between gap-4 "
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
          Products
        </span>
        <span className="rounded-[5px] bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-emerald-400 border border-zinc-800">
          {totalItems}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center gap-2 rounded-[5px] border border-zinc-800 bg-zinc-900/80 px-3 py-1.5">
          <ArrowUpDown size={13} className="text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent font-mono text-xs text-zinc-300 outline-none cursor-pointer pr-2"
          >
            <option value="price-asc" className="bg-zinc-900 text-zinc-300">
              Price: Low to High
            </option>
            <option value="price-desc" className="bg-zinc-900 text-zinc-300">
              Price: High to Low
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
