"use client";

import { useEffect, useState, useRef } from "react";
import LogoutModal from "@/components/modals/logoutModal";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

type ProfileMenuProps = {
  session: any;
  initials: string;
};

export default function ProfileMenu({ session, initials }: ProfileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
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
          className="cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-1.5">
            <img
              src={session.user.picture}
              alt={session.user.name ?? "Account"}
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full object-cover transition-colors border border-zinc-700"
            />
            <p className="text-sm text-zinc-400">
              {session.user.name?.split(" ")[0] ?? "Account"}
            </p>
          </div>
        </button>
      ) : (
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-emerald-400/10 font-mono text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/30"
        >
          {initials || "U"}
        </button>
      )}

      {menuOpen && (
        <div className="absolute right-0 top-10 z-50 w-44 rounded-sm border border-zinc-800 bg-zinc-900 p-1.5 shadow-xl">
          <Link
            href="/orders"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800"
          >
            <ShoppingBag size={16} className="text-zinc-400" />
            <span>My purchases</span>
          </Link>
          <LogoutModal />
        </div>
      )}
    </div>
  );
}
