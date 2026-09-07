"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

export default function SearchBar() {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative mx-4 flex flex-1 max-w-md items-center"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search
          size={16}
          className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}
        />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className={`w-full rounded-md border py-2 pl-9 pr-4 font-mono text-xs transition-all focus:outline-none focus:ring-1 ${
          isDarkMode
            ? "border-zinc-800 bg-zinc-900/80 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-700 focus:bg-zinc-900 focus:ring-emerald-400/50"
            : "border-zinc-200 bg-zinc-100/80 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-emerald-500/50"
        }`}
      />
    </form>
  );
}
