"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

function AdminLogoutButton() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="mx-[-16]">
      <Link
        href="/"
        target="_blank"
        className={`flex items-center border-t py-6 gap-3 px-8 font-mono text-xs transition-colors ${
          isDarkMode
            ? "border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
            : "border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
      >
        <span>Log-out</span>
        <LogOut
          size={13}
          className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}
        />
      </Link>
    </div>
  );
}

export default AdminLogoutButton;
