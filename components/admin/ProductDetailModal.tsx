"use client";

import { X, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  total_sold?: number;
  totalSold?: number;
  category: string;
  category_id?: number;
  image_url: string | null;
  images?: { url: string; sort_order?: number; alt_text?: string }[];
  description?: string;
  specs?: Record<string, any>;
};

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  const { isDarkMode } = useDarkMode();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (product) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        setImageUrls(product.images.map((img) => img.url).filter(Boolean));
      } else if (product.image_url) {
        setImageUrls([product.image_url]);
      } else {
        setImageUrls([]);
      }
    } else {
      setImageUrls([]);
    }
    setCurrentIndex(0);
  }, [product]);

  if (!isOpen || !product) return null;

  const lowStock = product.stock <= 5 && product.stock > 0;
  const outOfStock = product.stock === 0;
  const soldCount = product.total_sold ?? product.totalSold ?? 0;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm sm:p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`h-full max-h-full w-full max-w-none overflow-y-auto border-0 p-4 shadow-xl font-mono text-xs cursor-default sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-lg sm:border sm:p-6 ${
          isDarkMode
            ? "border-[#2A2F34] bg-zinc-900 text-zinc-300"
            : "border-zinc-200 bg-white text-zinc-700"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b pb-4 mb-6 ${
            isDarkMode ? "border-[#2A2F34]" : "border-zinc-200"
          }`}
        >
          <h2
            className={`text-sm font-bold uppercase tracking-wider ${
              isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
            }`}
          >
            Product Details
          </h2>
          <button
            onClick={onClose}
            className={`cursor-pointer transition-colors ${
              isDarkMode
                ? "text-[#6B7278] hover:text-[#F2F0EB]"
                : "text-zinc-400 hover:text-zinc-800"
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <div
              className={`relative w-full h-72 md:h-full min-h-70 overflow-hidden rounded-md border flex items-center justify-center ${
                isDarkMode
                  ? "border-[#2A2F34] bg-zinc-950"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            >
              {imageUrls.length > 0 ? (
                <>
                  <img
                    src={imageUrls[currentIndex]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                  {imageUrls.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors border border-zinc-700 cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors border border-zinc-700 cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 bg-zinc-900/80 border border-zinc-700 px-2 py-0.5 rounded-sm font-mono text-[10px] text-white">
                        {currentIndex + 1} / {imageUrls.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Package size={48} className="text-[#6B7278]" />
              )}
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div
                className={`rounded-md border p-3 space-y-2.5 ${
                  isDarkMode
                    ? "border-[#2A2F34] bg-zinc-950"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">ID:</span>
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
                    }`}
                  >
                    {product.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Name:</span>
                  <span
                    className={`font-medium text-right truncate max-w-45 ${
                      isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
                    }`}
                  >
                    {product.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Slug:</span>
                  <span
                    className={`text-right truncate max-w-45 ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {product.slug}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Category:</span>
                  <span
                    className={`uppercase text-right ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Price:</span>
                  <span
                    className={`font-semibold text-right ${
                      isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
                    }`}
                  >
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Total Sold:</span>
                  <span
                    className={`font-semibold text-right ${
                      isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
                    }`}
                  >
                    {soldCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Stock:</span>
                  <span
                    className={`font-bold text-right ${
                      outOfStock
                        ? "text-[#C97066]"
                        : lowStock
                          ? "text-[#D1A053]"
                          : isDarkMode
                            ? "text-[#F2F0EB]"
                            : "text-zinc-900"
                    }`}
                  >
                    {product.stock}{" "}
                    {outOfStock
                      ? "(Out of Stock)"
                      : lowStock
                        ? "(Low Stock)"
                        : ""}
                  </span>
                </div>
                {product.description && (
                  <div
                    className={`pt-2 border-t ${
                      isDarkMode ? "border-[#2A2F34]" : "border-zinc-200"
                    }`}
                  >
                    <span className="text-[#6B7278] uppercase block mb-1">
                      Description:
                    </span>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDarkMode ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div
                  className={`rounded-md border p-3 space-y-2 ${
                    isDarkMode
                      ? "border-[#2A2F34] bg-zinc-950"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <h3 className="text-[11px] font-bold uppercase text-[#6B7278] mb-1">
                    Specifications
                  </h3>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex justify-between items-center border-b pb-1.5 last:border-0 last:pb-0 ${
                        isDarkMode
                          ? "border-[#2A2F34]/50"
                          : "border-zinc-200/50"
                      }`}
                    >
                      <span className="text-[#6B7278] uppercase">{key}:</span>
                      <span
                        className={`text-right ${
                          isDarkMode ? "text-zinc-200" : "text-zinc-800"
                        }`}
                      >
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`flex justify-end pt-4 border-t ${
            isDarkMode ? "border-[#2A2F34]" : "border-zinc-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`rounded border px-4 py-2 font-mono text-xs transition-colors cursor-pointer ${
              isDarkMode
                ? "border-[#2A2F34] bg-zinc-800 text-[#F2F0EB] hover:bg-zinc-700"
                : "border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
