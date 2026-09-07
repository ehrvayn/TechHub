"use client";

import { useEffect, useState, useRef } from "react";
import LogoutModal from "@/components/modals/logoutModal";
import SupportModal from "@/components/modals/supportModal";
import { useDarkMode } from "@/context/DarkModeContext";
import {
  ShoppingBag,
  LayoutDashboard,
  ChevronDown,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";

type ProfileSession = {
  user: {
    picture?: string | null;
    name?: string | null;
  };
};

type ProfileMenuProps = {
  session: ProfileSession;
  initials: string;
  role?: string;
};

export default function ProfileMenu({
  session,
  initials,
  role,
}: ProfileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div ref={menuRef} className="relative flex items-center gap-3">
      {session.user.picture ? (
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-1.5">
            <img
              src={session.user.picture}
              alt={session.user.name ?? "Account"}
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full border border-zinc-700 object-cover transition-colors"
            />
            <p
              className={`text-sm ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}
            >
              {session.user.name?.split(" ")[0] ?? "Account"}
            </p>
            <ChevronDown
              size={16}
              className={`transition-transform ${menuOpen ? "rotate-180" : ""} ${
                isDarkMode ? "text-zinc-100" : "text-zinc-900"
              }`}
            />
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full font-mono text-xs font-semibold ring-1 ${
            isDarkMode
              ? "bg-emerald-400/10 text-emerald-400 ring-emerald-400/30"
              : "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30"
          }`}
        >
          {initials || "U"}
        </button>
      )}

      {menuOpen && (
        <div
          className={`absolute right-0 top-10 z-50 w-44 rounded-sm border p-1.5 shadow-xl ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-zinc-200 bg-white"
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDarkMode((prev) => !prev);
            }}
            className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
              isDarkMode
                ? "text-zinc-100 hover:bg-zinc-800"
                : "text-zinc-800 hover:bg-zinc-100"
            }`}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          >
            <span className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon size={16} className="text-zinc-400" />
              ) : (
                <Sun size={16} className="text-amber-500" />
              )}
              <span>Dark mode</span>
            </span>
            <span
              aria-hidden="true"
              className={`flex h-4 w-8 items-center rounded-full transition-colors ${
                isDarkMode ? "bg-emerald-500" : "bg-zinc-300"
              }`}
            >
              <span
                className={`h-3 w-3 rounded-full bg-white transition-transform ${
                  isDarkMode ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>

          <div
            className={`my-1 border-t ${
              isDarkMode ? "border-zinc-800" : "border-zinc-200"
            }`}
          />

          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                isDarkMode
                  ? "text-zinc-100 hover:bg-zinc-800"
                  : "text-zinc-800 hover:bg-zinc-100"
              }`}
            >
              <LayoutDashboard
                size={16}
                className={isDarkMode ? "text-zinc-400" : "text-zinc-500"}
              />
              <span>Dashboard</span>
            </Link>
          )}

          <Link
            href="/orders"
            onClick={() => setMenuOpen(false)}
            className={`flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
              isDarkMode
                ? "text-zinc-100 hover:bg-zinc-800"
                : "text-zinc-800 hover:bg-zinc-100"
            }`}
          >
            <ShoppingBag
              size={16}
              className={isDarkMode ? "text-zinc-400" : "text-zinc-500"}
            />
            <span>My purchases</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setSupportOpen(true);
              setMenuOpen(false);
            }}
            className={`flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
              isDarkMode
                ? "text-zinc-100 hover:bg-zinc-800"
                : "text-zinc-800 hover:bg-zinc-100"
            }`}
          >
            <HelpCircle
              size={16}
              className={isDarkMode ? "text-zinc-400" : "text-zinc-500"}
            />
            <span>Help / Support</span>
          </button>

          <LogoutModal />
        </div>
      )}

      <SupportModal
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
      />
    </div>
  );
}
