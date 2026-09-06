"use client";

import { useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ProductDetailModal from "@/components/modals/ProductDetails";
import StarRating from "@/components/ui/StarRating";

type ProductCardProps = {
  productId: number;
  name: string;
  price: number;
  category: string;
  stock?: number;
  totalSold?: number;
  imageUrl: string | null;
  altText: string | null;
  avgRating?: number;
  reviewCount?: number;
};

function StockIndicator({ stock }: { stock: number }) {
  const status =
    stock === 0
      ? { color: "bg-red-500", label: "Out of stock" }
      : { color: "bg-amber-400", label: `${stock} left` };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-mono uppercase tracking-wide text-zinc-500">
        {status.label}
      </span>
    </div>
  );
}

function ProductCard({
  productId,
  name,
  price,
  category,
  stock = 0,
  totalSold = 0,
  imageUrl,
  altText,
  avgRating = 0,
  reviewCount = 0,
}: ProductCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setDetailsOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
      >
        <div className="relative aspect-square bg-zinc-950">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={altText ?? name}
              fill
              sizes="1"
              className="object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-700">
                No image
              </span>
            </div>
          )}
          <span className="absolute left-2 top-2 rounded-sm border border-zinc-700 bg-zinc-900/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            {category}
          </span>
        </div>

        <div className="border-t border-zinc-800 p-3">
          <h3 className="text-sm font-medium leading-snug text-zinc-100">
            {name}
          </h3>

          <div className="mt-1 flex items-center gap-1.5">
            <StarRating rating={avgRating} size={11} />
            <span className="font-mono text-[10px] text-zinc-600">
              {reviewCount > 0 ? `(${reviewCount})` : "No reviews"}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="font-mono text-[10px] text-zinc-500">
              {totalSold} sold
            </span>
          </div>

          <div className="mt-2 flex items-end justify-between">
            <span className="font-mono text-lg font-semibold text-zinc-50">
              ${Number(price).toFixed(2)}
            </span>
            <StockIndicator stock={stock} />
          </div>

          <div className="mt-3" onClick={(e) => e.stopPropagation()}>
            <AddToCartButton productId={productId} stock={stock} />
          </div>
        </div>
      </div>

      {detailsOpen && (
        <ProductDetailModal
          productId={productId}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </>
  );
}

export default ProductCard;
