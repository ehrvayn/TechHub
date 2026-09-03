"use client";

import { X, Package } from "lucide-react";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: string;
  category_id?: number;
  image_url: string | null;
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
  if (!isOpen || !product) return null;

  const lowStock = product.stock <= 5 && product.stock > 0;
  const outOfStock = product.stock === 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-lg border border-[#2A2F34] bg-zinc-900 p-6 shadow-xl font-mono text-xs text-zinc-300 max-h-[90vh] overflow-y-auto cursor-default"
      >
        <div className="flex items-center justify-between border-b border-[#2A2F34] pb-4 mb-6">
          <h2 className="text-sm font-bold text-[#F2F0EB] uppercase tracking-wider">
            Product Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <div className="w-full h-72 md:h-full min-h-70 overflow-hidden rounded-md border border-[#2A2F34] bg-zinc-950 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package size={48} className="text-[#6B7278]" />
              )}
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="rounded-md border border-[#2A2F34] bg-zinc-950 p-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">ID:</span>
                  <span className="text-[#F2F0EB] font-medium">
                    {product.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Name:</span>
                  <span className="text-[#F2F0EB] font-medium text-right truncate max-w-45">
                    {product.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Slug:</span>
                  <span className="text-zinc-400 text-right truncate max-w-45">
                    {product.slug}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Category:</span>
                  <span className="text-zinc-400 uppercase text-right">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7278] uppercase">Price:</span>
                  <span className="text-[#F2F0EB] font-semibold text-right">
                    ${Number(product.price).toFixed(2)}
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
                          : "text-[#F2F0EB]"
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
                  <div className="pt-2 border-t border-[#2A2F34]">
                    <span className="text-[#6B7278] uppercase block mb-1">
                      Description:
                    </span>
                    <p className="text-zinc-300 text-xs leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="rounded-md border border-[#2A2F34] bg-zinc-950 p-3 space-y-2">
                  <h3 className="text-[11px] font-bold uppercase text-[#6B7278] mb-1">
                    Specifications
                  </h3>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center border-b border-[#2A2F34]/50 pb-1.5 last:border-0 last:pb-0"
                    >
                      <span className="text-[#6B7278] uppercase">{key}:</span>
                      <span className="text-zinc-200 text-right">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#2A2F34]">
          <button
            onClick={onClose}
            className="rounded border border-[#2A2F34] bg-zinc-800 px-4 py-2 font-mono text-xs text-[#F2F0EB] hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
