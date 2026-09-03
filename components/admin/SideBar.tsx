"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogo from "../../public/img/AdminLogo.png";
import LogoutModal from "@/components/modals/logoutModal";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Bell,
  Settings,
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
    label: "Inventory",
    href: "/admin/inventory",
    icon: Package,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
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
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between border-r border-solid border-zinc-700 bg-zinc-950 px-4 pt-4 select-none">
      <div className="space-y-6">
        <div className="px-2 py-1">
          <img src={AdminLogo.src} alt="TechHub Logo" className="h-17 w-full" />
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
                className={`flex items-center gap-3 rounded-[2] px-3 py-2 font-mono text-xs transition-colors ${
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

      <div className="mb-4 -mx-4 border-t border-zinc-800 bg-zinc-950 pt-3 px-3">
        <LogoutModal />
      </div>
    </aside>
  );
}
