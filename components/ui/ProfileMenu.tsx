"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import LogoutModal from "@/components/modals/logoutModal";
import SupportModal from "@/components/modals/supportModal";
import {
  ShoppingBag,
  LayoutDashboard,
  ChevronDown,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";

type Theme = "light" | "dark";

const themeListeners = new Set<() => void>();

const getThemeSnapshot = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  return localStorage.getItem("theme") === "light" ? "light" : "dark";
};

const getServerThemeSnapshot = (): Theme => "dark";

const subscribeToTheme = (listener: () => void) => {
  themeListeners.add(listener);

  return () => {
    themeListeners.delete(listener);
  };
};

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
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

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

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    themeListeners.forEach((listener) => listener());
  };

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
            <p className="text-sm text-zinc-100">
              {session.user.name?.split(" ")[0] ?? "Account"}
            </p>
            {menuOpen ? (
              <ChevronDown size={16} className="rotate-180 text-zinc-100" />
            ) : (
              <ChevronDown size={16} className="text-zinc-100" />
            )}
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-emerald-400/10 font-mono text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/30"
        >
          {initials || "U"}
        </button>
      )}

      {menuOpen && (
        <div className="absolute right-0 top-10 z-50 w-44 rounded-sm border border-zinc-800 bg-zinc-900 p-1.5 shadow-xl">
          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800"
            >
              <LayoutDashboard size={16} className="text-zinc-400" />
              <span>Dashboard</span>
            </Link>
          )}

          <Link
            href="/orders"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800"
          >
            <ShoppingBag size={16} className="text-zinc-400" />
            <span>My purchases</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setSupportOpen(true);
              setMenuOpen(false);
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800"
          >
            <HelpCircle size={16} className="text-zinc-400" />
            <span>Help / Support</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon size={16} className="text-zinc-400" />
              ) : (
                <Sun size={16} className="text-zinc-400" />
              )}
              <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
            </span>
            <span
              aria-hidden="true"
              className={`flex h-4 w-8 items-center rounded-full transition-colors ${
                theme === "dark" ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`h-3 w-3 rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
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
