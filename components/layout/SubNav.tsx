"use client";

import { Menu, ChevronDown } from "lucide-react";
import { useState } from "react";

type SubNavProps = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  activeQuickLink: string | null;
  setActiveQuickLink: (link: string | null) => void;
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
];

const QUICK_LINKS = [
  "Bestsellers",
  "New Arrivals",
];

export default function SubNav({
  selectedCategory,
  setSelectedCategory,
  activeQuickLink,
  setActiveQuickLink,
}: SubNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="sticky top-15.25 z-40 mb-6 flex items-center gap-4 border-b border-zinc-800 bg-zinc-950/95 py-3 backdrop-blur-md font-mono text-xs text-zinc-400">
      <div className="relative shrink-0">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 font-medium text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
        >
          <Menu size={14} />
          <span>
            {activeQuickLink
              ? "All Categories"
              : CATEGORIES.find((c) => c.slug === selectedCategory)?.label ||
                "All Categories"}
          </span>
          <ChevronDown size={14} className="text-zinc-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 w-44 rounded-md border border-zinc-800 bg-zinc-900 py-1 shadow-xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setActiveQuickLink(null);
                  setDropdownOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left transition-colors hover:bg-zinc-800 ${
                  !activeQuickLink && selectedCategory === cat.slug
                    ? "font-semibold text-emerald-400"
                    : "text-zinc-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap">
        {QUICK_LINKS.map((link) => (
          <button
            key={link}
            type="button"
            onClick={() => {
              setActiveQuickLink(link);
              setDropdownOpen(false);
            }}
            className={`cursor-pointer transition-colors ${
              activeQuickLink === link
                ? "font-semibold text-emerald-400"
                : "hover:text-zinc-100"
            }`}
          >
            {link}
          </button>
        ))}
      </div>
    </div>
  );
}
