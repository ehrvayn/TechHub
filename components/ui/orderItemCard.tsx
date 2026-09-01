"use client";

import Image from "next/image";

type OrderItemCardProps = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: string;
  imageUrl: string | null;
};

export default function OrderItemCard({
  id,
  name,
  price,
  quantity,
  status,
  imageUrl,
}: OrderItemCardProps) {
  const safePrice = Number(price) || 0;
  const safeQuantity = Number(quantity) || 1;
  const isPending = status.toLowerCase() === "pending";

  return (
    <div className="flex items-center gap-4 rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700/80">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">
              No image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-1.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-zinc-100">{name}</p>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
              isPending
                ? "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/30"
                : "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/30"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
          <span>${safePrice.toFixed(2)}</span>
          <span>•</span>
          <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-zinc-300">
            Qty: {safeQuantity}
          </span>
        </div>
      </div>

      <div className="text-right">
        <p className="font-mono text-xs text-zinc-500">Total</p>
        <p className="font-mono text-sm font-semibold text-zinc-50">
          ${(safePrice * safeQuantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
