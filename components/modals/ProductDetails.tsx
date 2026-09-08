"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Loader2,
  ShoppingCart,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ReviewSection from "../ReviewSection";
import { useDarkMode } from "@/context/DarkModeContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

type ProductDetail = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  total_sold?: number;
  totalSold?: number;
  category: string;
  image_url: string | null;
  images?: { url: string; sort_order?: number; alt_text?: string }[];
  alt_text: string | null;
  specs?: Record<string, any>;
};

type ProductDetailModalProps = {
  productId: number;
  onClose: () => void;
};

export default function ProductDetailModal({
  productId,
  onClose,
}: ProductDetailModalProps) {
  const { isDarkMode } = useDarkMode();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useBodyScrollLock(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

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

  const handleAddToCart = async () => {
    setAdding(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    setAdding(false);

    if (res.status === 401) {
      router.push("/auth/login");
      return;
    }
    onClose();
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    if (res.status === 401) {
      router.push("/auth/login");
      return;
    }
    const result = await res.json();
    setBuyingNow(false);
    if (result.success) {
      router.push(`/checkout?items=${result.item.id}`);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const soldCount = product?.total_sold ?? product?.totalSold ?? 0;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm sm:px-4 ${
        isDarkMode ? "bg-black/60" : "bg-black/40"
      }`}
      onClick={onClose}
    >
      <div
        className={`h-full max-h-full w-full max-w-none overflow-y-auto border-0 font-mono text-xs sm:h-auto sm:max-h-[85vh] sm:max-w-3xl sm:rounded-md sm:border ${
          isDarkMode
            ? "border-zinc-800 bg-zinc-900 text-zinc-300"
            : "border-zinc-200 bg-white text-zinc-700"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-zinc-200 bg-white"
          }`}
        >
          <span
            className={`rounded-sm border px-1.5 py-0.5 uppercase tracking-wider ${
              isDarkMode
                ? "border-zinc-700 bg-zinc-800/60 text-zinc-400"
                : "border-zinc-300 bg-zinc-100 text-zinc-600"
            }`}
          >
            {product?.category}
          </span>
          <button
            onClick={onClose}
            className={`cursor-pointer ${
              isDarkMode
                ? "text-zinc-500 hover:text-zinc-300"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {loading || !product ? (
          <div className="flex justify-center py-16">
            <Loader2
              size={20}
              className={`animate-spin ${
                isDarkMode ? "text-zinc-600" : "text-zinc-400"
              }`}
            />
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-start-1 sm:row-start-1">
              <div
                className={`relative aspect-square rounded-sm border overflow-hidden ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-950"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                {imageUrls.length > 0 ? (
                  <>
                    <Image
                      src={imageUrls[currentIndex]}
                      alt={product.alt_text ?? product.name}
                      fill
                      className="object-contain p-4"
                    />
                    {imageUrls.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 text-white p-1.5 rounded-full transition-colors border cursor-pointer ${
                            isDarkMode
                              ? "bg-black/60 hover:bg-black/80 border-zinc-700"
                              : "bg-black/40 hover:bg-black/60 border-zinc-700"
                          }`}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={nextImage}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 text-white p-1.5 rounded-full transition-colors border cursor-pointer ${
                            isDarkMode
                              ? "bg-black/60 hover:bg-black/80 border-zinc-700"
                              : "bg-black/40 hover:bg-black/60 border-zinc-700"
                          }`}
                        >
                          <ChevronRight size={16} />
                        </button>
                        <div
                          className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-30 border px-2 py-0.5 rounded-sm font-mono text-[10px] text-white ${
                            isDarkMode
                              ? "bg-zinc-900/80 border-zinc-700"
                              : "bg-black/50 border-zinc-600"
                          }`}
                        >
                          {currentIndex + 1} / {imageUrls.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span
                      className={`uppercase ${
                        isDarkMode ? "text-zinc-700" : "text-zinc-500"
                      }`}
                    >
                      No image
                    </span>
                  </div>
                )}
              </div>

            </div>

            <div className="flex flex-col justify-between space-y-4 sm:col-start-2 sm:row-start-1">
              <div className="space-y-2">
                <h1
                  className={`text-base font-semibold ${
                    isDarkMode ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  {product.name}
                </h1>

                <div
                  className={`flex items-baseline justify-between rounded-sm border p-3 ${
                    isDarkMode
                      ? "border-zinc-800 bg-zinc-950"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <span
                    className={`text-xl font-bold ${
                      isDarkMode ? "text-zinc-50" : "text-zinc-900"
                    }`}
                  >
                    ${Number(product.price).toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-zinc-500">
                      {soldCount.toLocaleString()} sold
                    </span>
                    <span
                      className={isDarkMode ? "text-zinc-700" : "text-zinc-300"}
                    >
                      |
                    </span>
                    <span
                      className={`font-semibold ${
                        product.stock === 0
                          ? isDarkMode
                            ? "text-red-400"
                            : "text-red-500"
                          : isDarkMode
                            ? "text-emerald-400"
                            : "text-emerald-600"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : `${product.stock} left`}
                    </span>
                  </div>

                </div>

                {product.description && (
                  <div
                    className={`rounded-sm border p-3 ${
                      isDarkMode
                        ? "border-zinc-800 bg-zinc-950"
                        : "border-zinc-200 bg-zinc-50"
                    }`}
                  >
                    <span
                      className={`uppercase block mb-1 ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-600"
                      }`}
                    >
                      Description
                    </span>
                    <p
                      className={`leading-relaxed font-sans text-xs ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-700"
                      }`}
                    >
                      {product.description}
                    </p>
                  </div>
                )}

                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div
                    className={`flex flex-col gap-1.5 rounded-sm border p-3 ${
                      isDarkMode
                        ? "border-zinc-800 bg-zinc-950"
                        : "border-zinc-200 bg-zinc-50"
                    }`}
                  >
                    <span
                      className={`uppercase mb-1 font-bold ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-600"
                      }`}
                    >
                      Specifications
                    </span>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex justify-between border-b pb-1 last:border-0 last:pb-0 ${
                          isDarkMode ? "border-zinc-800/50" : "border-zinc-200"
                        }`}
                      >
                        <span className="capitalize text-zinc-500">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span
                          className={`text-right ${
                            isDarkMode ? "text-zinc-300" : "text-zinc-800"
                          }`}
                        >
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {product.stock > 0 && (
                  <div
                    className={`flex items-center justify-between rounded-sm border p-3 ${
                      isDarkMode
                        ? "border-zinc-800 bg-zinc-950"
                        : "border-zinc-200 bg-zinc-50"
                    }`}
                  >
                    <span
                      className={`uppercase ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-600"
                      }`}
                    >
                      Quantity
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className={`px-2.5 py-1 rounded-sm border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                          isDarkMode
                            ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                            : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                        }`}
                      >
                        -
                      </button>
                      <span
                        className={`w-8 text-center font-bold ${
                          isDarkMode ? "text-zinc-100" : "text-zinc-900"
                        }`}
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((q) => Math.min(product.stock, q + 1))
                        }
                        disabled={quantity >= product.stock}
                        className={`px-2.5 py-1 rounded-sm border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                          isDarkMode
                            ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                            : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                        }`}
                      >
                        +
                      </button>
                    </div>

                  </div>
                )}
              </div>

              <div
                className={`flex gap-2 pt-2 border-t ${
                  isDarkMode ? "border-zinc-800" : "border-zinc-200"
                }`}
              >
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || adding}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm border py-2.5 uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                    isDarkMode
                      ? "border-zinc-700 text-zinc-300 hover:border-emerald-400/50 hover:text-emerald-400"
                      : "border-zinc-300 text-zinc-700 hover:border-emerald-600 hover:text-emerald-600"
                  }`}
                >
                  <ShoppingCart size={14} />
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || buyingNow}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm py-2.5 font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed cursor-pointer ${
                    isDarkMode
                      ? "bg-emerald-400 text-zinc-950 hover:bg-emerald-300 disabled:bg-zinc-800 disabled:text-zinc-600"
                      : "bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-zinc-200 disabled:text-zinc-400"
                  }`}
                >
                  <Zap size={14} />
                  {buyingNow ? "..." : "Buy Now"}
                </button>
              </div>
            </div>

            </div>
            <div className="mt-5 sm:mt-6">
              <ReviewSection productId={product.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
