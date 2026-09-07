"use client";

import { useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ProductDetailModal from "@/components/modals/ProductDetails";
import StarRating from "@/components/ui/StarRating";
import { useDarkMode } from "@/context/DarkModeContext";

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

function StockIndicator({
  stock,
  isDarkMode,
}: {
  stock: number;
  isDarkMode: boolean;
}) {
  const status =
    stock === 0
      ? {
          color: isDarkMode ? "bg-red-500" : "bg-red-600",
          label: "Out of stock",
        }
      : {
          color: isDarkMode ? "bg-amber-400" : "bg-amber-500",
          label: `${stock} left`,
        };

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`text-[11px] font-mono uppercase tracking-wide ${
          isDarkMode ? "text-zinc-500" : "text-zinc-500"
        }`}
      >
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
  const { isDarkMode } = useDarkMode();
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setDetailsOpen(true)}
        className={`group relative cursor-pointer overflow-hidden rounded-sm border transition-colors ${
          isDarkMode
            ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            : "border-zinc-200 bg-white hover:border-zinc-300"
        }`}
      >
        <div
          className={`relative aspect-square ${
            isDarkMode ? "bg-zinc-950" : "bg-zinc-100"
          }`}
        >
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
              <span
                className={`font-mono text-[11px] uppercase tracking-widest ${
                  isDarkMode ? "text-zinc-700" : "text-zinc-400"
                }`}
              >
                No image
              </span>
            </div>
          )}
          <span
            className={`absolute left-2 top-2 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
              isDarkMode
                ? "border-zinc-700 bg-zinc-900/90 text-zinc-400"
                : "border-zinc-300 bg-white/90 text-zinc-600"
            }`}
          >
            {category}
          </span>
        </div>

        <div
          className={`border-t p-3 ${
            isDarkMode ? "border-zinc-800" : "border-zinc-200"
          }`}
        >
          <h3
            className={`text-sm font-medium leading-snug ${
              isDarkMode ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            {name}
          </h3>

          <div className="mt-1 flex items-center gap-1.5">
            <StarRating rating={avgRating} size={11} />
            <span
              className={`font-mono text-[10px] ${
                isDarkMode ? "text-zinc-600" : "text-zinc-400"
              }`}
            >
              {reviewCount > 0 ? `(${reviewCount})` : "No reviews"}
            </span>
            <span className={isDarkMode ? "text-zinc-700" : "text-zinc-300"}>
              |
            </span>
            <span
              className={`font-mono text-[10px] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-500"
              }`}
            >
              {totalSold} sold
            </span>
          </div>

          <div className="mt-2 flex items-end justify-between">
            <span
              className={`font-mono text-lg font-semibold ${
                isDarkMode ? "text-zinc-50" : "text-zinc-900"
              }`}
            >
              ${Number(price).toFixed(2)}
            </span>
            <StockIndicator stock={stock} isDarkMode={isDarkMode} />
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
