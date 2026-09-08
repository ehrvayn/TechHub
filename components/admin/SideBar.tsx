"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogo from "../../public/img/AdminLogo.png";
import LogoutModal from "@/components/modals/logoutModal";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ArrowLeft,
  Users,
  MessageSquare,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Management",
    items: [
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
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: MessageSquare,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <aside
      className={`sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between border-r select-none px-4 pt-2 ${
        isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white"
      }`}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-[2] py-2 font-mono text-xs transition-colors ${
              isDarkMode
                ? "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <ArrowLeft size={15} className="text-zinc-500" />
            <span>Back to Store</span>
          </Link>
          <div
            className={`h-px flex mx-[-17] ${
              isDarkMode ? "bg-zinc-800" : "bg-zinc-200"
            }`}
          />
        </div>

        <div className="px-2">
          <img
            src={AdminLogo.src}
            alt="TechHub Logo"
            className="h-14 px-5 w-full"
          />
        </div>

        <nav className="space-y-4">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                {section.title}
              </p>
              {section.items.map((item) => {
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
                        ? isDarkMode
                          ? "border border-zinc-800 bg-zinc-900 font-semibold text-zinc-100"
                          : "border border-zinc-200 bg-zinc-100 font-semibold text-zinc-900"
                        : isDarkMode
                          ? "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={
                        isActive ? "text-emerald-400" : "text-zinc-500"
                      }
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            setIsDarkMode(!isDarkMode);
          }}
          className={`flex w-full items-center justify-between rounded-xs px-3 py-2 font-mono text-xs transition-colors ${
            isDarkMode ? "text-zinc-400" : "text-zinc-600 "
          }`}
        >
          <span className="flex items-center gap-3">
            {isDarkMode ? (
              <Moon size={15} className="text-zinc-400" />
            ) : (
              <Sun size={15} className="text-amber-500" />
            )}
            <span>Dark Mode</span>
          </span>
          <div
            className={`relative inline-flex h-4 w-8 shrink-0 items-center rounded-full transition-colors ${
              isDarkMode ? "bg-emerald-600" : "bg-zinc-300"
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                isDarkMode ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
        </button>
        <div
          className={`mb-4 -mx-4 space-y-3 border-t px-4 pt-3 ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-950"
              : "border-zinc-200 bg-white"
          }`}
        >
          <LogoutModal />
        </div>
      </div>
    </aside>
  );
}
