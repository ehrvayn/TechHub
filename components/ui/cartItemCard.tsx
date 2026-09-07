"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

type CartItemCardProps = {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  imageUrl: string | null;
  selected: boolean;
  updating: boolean;
  onToggleSelect: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
};

function CartItemCard({
  id,
  name,
  price,
  stock,
  quantity,
  imageUrl,
  selected,
  updating,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`flex items-center gap-4 rounded-md border p-3 ${
        isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelect(id)}
        className="h-3.5 w-3.5 shrink-0 accent-emerald-400"
      />

      <div
        className={`relative h-16 w-16 shrink-0 rounded-sm ${
          isDarkMode ? "bg-zinc-950" : "bg-zinc-100"
        }`}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className={`font-mono text-[9px] uppercase ${
                isDarkMode ? "text-zinc-700" : "text-zinc-400"
              }`}
            >
              No image
            </span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <p
          className={`text-sm ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}
        >
          {name}
        </p>
        <p
          className={`font-mono text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}
        >
          ${price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(id, quantity - 1)}
          disabled={updating}
          className={`h-6 w-6 rounded-sm border text-xs disabled:opacity-50 ${
            isDarkMode
              ? "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
          }`}
        >
          −
        </button>
        <span
          className={`w-5 text-center font-mono text-sm ${
            isDarkMode ? "text-zinc-100" : "text-zinc-900"
          }`}
        >
          {quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          disabled={updating || quantity >= stock}
          className={`h-6 w-6 rounded-sm border text-xs disabled:opacity-50 ${
            isDarkMode
              ? "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
          }`}
        >
          +
        </button>
      </div>

      <span
        className={`w-16 text-right font-mono text-sm ${
          isDarkMode ? "text-zinc-100" : "text-zinc-900"
        }`}
      >
        ${(price * quantity).toFixed(2)}
      </span>

      <button
        onClick={() => onRemove(id)}
        disabled={updating}
        className={`disabled:opacity-50 ${
          isDarkMode
            ? "text-zinc-500 hover:text-red-400"
            : "text-zinc-400 hover:text-red-600"
        }`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default CartItemCard;
