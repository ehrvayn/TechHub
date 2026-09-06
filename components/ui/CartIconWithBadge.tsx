"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartCount } from "@/context/CartCountContext";

export default function CartIconWithBadge({
  activeCart,
}: {
  activeCart: boolean;
}) {
  const { count, itemAdded } = useCartCount();

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart
        size={20}
        className={`cursor-pointer transition-transform ${
          itemAdded ? "scale-150 text-emerald-400 border rounded-full p-1 border-emerald-400 animate-ping" : ""
        } ${
          activeCart ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-100"
        }`}
      />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-400 px-1 font-mono text-[9px] font-bold text-zinc-950">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
