"use client";

import Link from "next/link";
import { useCartCount } from "@/context/CartCountContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { FaShoppingCart } from "react-icons/fa";

export default function CartIconWithBadge({
  activeCart,
}: {
  activeCart: boolean;
}) {
  const { isDarkMode } = useDarkMode();
  const { count, itemAdded } = useCartCount();

  return (
    <Link href="/cart" className="relative">
      <FaShoppingCart
        size={20}
        className={`cursor-pointer transition-transform ${
          itemAdded
            ? "scale-150 text-emerald-400 border rounded-full p-1 border-emerald-400 animate-ping"
            : ""
        } ${
          activeCart
            ? "text-emerald-400"
            : isDarkMode
              ? "text-zinc-400 hover:text-zinc-100"
              : "text-zinc-600 hover:text-zinc-900"
        }`}
      />
      {count > 0 && (
        <span
          className={`absolute -right-1.5 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-white`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
