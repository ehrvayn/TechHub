"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
<aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between border-r border-solid border-zinc-700 bg-zinc-950 p-4 select-none">

      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
            <Shield size={15} />
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-zinc-100 tracking-wide">
              TechHub
            </p>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
              Admin Workspace
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 font-mono text-xs transition-colors ${
                  isActive
                    ? "border border-zinc-800 bg-zinc-900 font-semibold text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? "text-emerald-400" : "text-zinc-500"}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-800/80 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-md px-3 py-2 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-900/50 hover:text-zinc-200"
        >
          <span>Log-out</span>
          <LogOut size={13} className="text-zinc-500" />
        </Link>
      </div>
    </aside>
  );
}
