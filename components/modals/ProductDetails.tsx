"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Loader2, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

type ProductDetail = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
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
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900 font-mono text-xs text-zinc-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-5 py-4">
          <div className="flex justify-center items-center gap-3">
            <div className="flex items-center justify-between">
              <span className="rounded-sm border border-zinc-700 bg-zinc-800/60 px-1.5 py-0.5 uppercase tracking-wider text-zinc-400">
                {product?.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {loading || !product ? (
          <div className="flex justify-center py-16">
            <Loader2 size={20} className="animate-spin text-zinc-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2">
            <div className="relative aspect-square rounded-sm bg-zinc-950 border border-zinc-800 overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.alt_text ?? product.name}
                  fill
                  className="object-contain p-4"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="uppercase text-zinc-700">No image</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div>
                  <h1 className="text-base font-semibold text-zinc-100">
                    {product.name}
                  </h1>
                </div>

                <div className="flex items-baseline justify-between rounded-sm border border-zinc-800 bg-zinc-950 p-3">
                  <span className="text-xl font-bold text-zinc-50">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span
                    className={`font-semibold ${
                      product.stock === 0 ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : `${product.stock} left`}
                  </span>
                </div>

                {product.description && (
                  <div className="rounded-sm border border-zinc-800 bg-zinc-950 p-3">
                    <span className="text-zinc-500 uppercase block mb-1">
                      Description
                    </span>
                    <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                      {product.description}
                    </p>
                  </div>
                )}

                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div className="flex flex-col gap-1.5 rounded-sm border border-zinc-800 bg-zinc-950 p-3">
                    <span className="text-zinc-500 uppercase mb-1 font-bold">
                      Specifications
                    </span>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b border-zinc-800/50 pb-1 last:border-0 last:pb-0"
                      >
                        <span className="capitalize text-zinc-500">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-zinc-300 text-right">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {product.stock > 0 && (
                  <div className="flex items-center justify-between rounded-sm border border-zinc-800 bg-zinc-950 p-3">
                    <span className="text-zinc-500 uppercase">Quantity</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-2.5 py-1 rounded-sm border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-zinc-100">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((q) => Math.min(product.stock, q + 1))
                        }
                        disabled={quantity >= product.stock}
                        className="px-2.5 py-1 rounded-sm border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || adding}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-zinc-700 py-2.5 uppercase tracking-wide text-zinc-300 transition-colors hover:border-emerald-400/50 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <ShoppingCart size={14} />
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || buyingNow}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-emerald-400 py-2.5 font-semibold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
                >
                  <Zap size={14} />
                  {buyingNow ? "..." : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
