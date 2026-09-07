"use client";

import AdminOrdersFeed from "@/components/admin/AdminOrdersFeed";
import { useDarkMode } from "@/context/DarkModeContext";

export default function AdminOrdersPage() {
  const { isDarkMode } = useDarkMode();

  return (
    <div>
      <h2
        className={`mb-6 font-mono text-lg uppercase tracking-widest ${
          isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
        }`}
      >
        Orders
      </h2>
      <AdminOrdersFeed />
    </div>
  );
}
