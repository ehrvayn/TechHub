"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

type SubNavProps = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  activeQuickLink: string | null;
  setActiveQuickLink: (link: string | null) => void;
  totalItems: number;
  sortBy: string;
  onSortChange: (value: string) => void;
};

const CATEGORIES = [
  { label: "All Categories", slug: "all" },
  { label: "CPU", slug: "cpu" },
  { label: "GPU", slug: "gpu" },
  { label: "RAM", slug: "ram" },
  { label: "Motherboard", slug: "motherboard" },
  { label: "PSU", slug: "psu" },
  { label: "Storage", slug: "storage" },
  { label: "Cooling", slug: "cooling" },
  { label: "Case", slug: "case" },
  { label: "Monitor", slug: "monitor" },
  { label: "Keyboard", slug: "keyboard" },
  { label: "Mice", slug: "mice" },
  { label: "Audio & Headsets", slug: "audio" },
  { label: "Thermal Paste", slug: "thermal-paste" },
  { label: "Capture Cards", slug: "capture-cards" },
  { label: "Networking", slug: "networking" },
  { label: "Custom Cables", slug: "custom-cables" },
  { label: "UPS & Power", slug: "ups-power" },
  { label: "Pre-built PCs", slug: "prebuilt-pcs" },
  { label: "Laptops", slug: "laptops" },
  { label: "Cables & Adapters", slug: "cables-adapters" },
];
const QUICK_LINKS = ["Bestsellers", "New Arrivals"];
const SORT_OPTIONS = [
  { label: "Low to High", value: "price-asc" },
  { label: "High to Low", value: "price-desc" },
];

export default function SubNav({
  selectedCategory,
  setSelectedCategory,
  activeQuickLink,
  setActiveQuickLink,
  totalItems,
  sortBy,
  onSortChange,
}: SubNavProps) {
  const { isDarkMode } = useDarkMode();
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div
      className={`sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col gap-5 overflow-y-auto pr-2 font-mono text-xs scrollbar-thin ${
        isDarkMode ? "text-zinc-400" : "text-zinc-600"
      }`}
    >
      <div
        className={`flex flex-col gap-3 rounded-[5px] border p-2.5 ${
          isDarkMode
            ? "border-zinc-800 bg-zinc-900/40"
            : "border-zinc-200 bg-zinc-50/40"
        }`}
      >
        <div className="flex items-center justify-between px-1">
          <span
            className={`font-mono text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            Products
          </span>
          <span
            className={`px-2 py-0.5 font-mono text-[11px] ${
              isDarkMode ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            {totalItems}
          </span>
        </div>
        <div
          className={`h-px ${isDarkMode ? "bg-zinc-400/30" : "bg-zinc-200"}`}
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((prev) => !prev)}
            className={`flex w-full items-center gap-2 rounded-[5px] border px-2.5 py-1.5 transition-colors ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
            }`}
          >
            <ArrowUpDown
              size={13}
              className={`shrink-0 ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            />
            <span className="flex-1 text-left truncate">
              {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ||
                "Price:"}
            </span>
          </button>

          {sortOpen && (
            <div
              className={`absolute left-0 top-full z-50 mt-1 w-full rounded-[5px] border py-1 shadow-lg ${
                isDarkMode
                  ? "border-zinc-800 bg-zinc-900"
                  : "border-zinc-200 bg-white"
              }`}
            >
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSortChange(option.value);
                    setSortOpen(false);
                  }}
                  className={`block w-full px-3 py-1.5 text-left transition-colors ${
                    isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
                  } ${
                    sortBy === option.value
                      ? isDarkMode
                        ? "font-semibold text-emerald-400"
                        : "font-semibold text-emerald-600"
                      : isDarkMode
                        ? "text-zinc-300"
                        : "text-zinc-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Quick Links
        </span>
        <div className="flex flex-col gap-0.5">
          {QUICK_LINKS.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => {
                setActiveQuickLink(activeQuickLink === link ? null : link);
              }}
              className={`cursor-pointer px-2.5 py-1.5 text-left ${
                activeQuickLink === link
                  ? isDarkMode
                    ? "border-b-2 border-emerald-500/50 bg-emerald-500/10 font-semibold text-emerald-400"
                    : "border-b-2 border-emerald-500/50 bg-emerald-50/50 font-semibold text-emerald-600"
                  : isDarkMode
                    ? "rounded-sm border-b-2 border-emerald-400/0 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                    : "rounded-sm border-b-2 border-emerald-400/0 text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900"
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 pb-4">
        <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Categories
        </span>
        <div className="flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.slug);
                setActiveQuickLink(null);
              }}
              className={`cursor-pointer px-2.5 py-1.5 text-left ${
                !activeQuickLink && selectedCategory === cat.slug
                  ? isDarkMode
                    ? "border-b-2 border-emerald-500/50 bg-emerald-500/10 font-semibold text-emerald-400"
                    : "border-b-2 border-emerald-500/50 bg-emerald-50/50 font-semibold text-emerald-600"
                  : isDarkMode
                    ? "rounded-sm border-b-2 border-emerald-400/0 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                    : "rounded-sm border-b-2 border-emerald-400/0 text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
