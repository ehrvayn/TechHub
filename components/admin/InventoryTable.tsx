"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Pencil,
  Trash2,
  ArrowUpDown,
  ChevronRight,
} from "lucide-react";
import ProductFormModal from "./ProductFormModal";
import ProductDetailsModal from "./ProductDetailModal";
import { useDarkMode } from "@/context/DarkModeContext";

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
  description?: string;
  specs?: Record<string, any>;
};

type InventoryTableProps = {};

export default function InventoryTable({}: InventoryTableProps) {
  const { isDarkMode } = useDarkMode();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<Product | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await fetchProducts();
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const openDetailsModal = (product: Product) => {
    setSelectedProductDetails(product);
    setDetailsModalOpen(true);
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category)),
  ).filter(Boolean);

  const filteredProducts = products
    .filter(
      (p) =>
        selectedCategory === "all" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase(),
    )
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === "asc")
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={20} className="animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-sm border ${
        isDarkMode
          ? "border-[#2A2F34] bg-zinc-800/20"
          : "border-zinc-200 bg-white"
      }`}
    >
      <div
        className={`flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
          isDarkMode ? "border-[#2A2F34]" : "border-zinc-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <h2
            className={`font-mono text-[11px] uppercase tracking-widest ${
              isDarkMode ? "text-[#6B7278]" : "text-zinc-500"
            }`}
          >
            Products ({filteredProducts.length})
          </h2>

          <div className="flex items-center gap-1.5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`rounded-sm border cursor-pointer px-2.5 py-1 font-mono text-xs uppercase focus:outline-none ${
                isDarkMode
                  ? "border-[#2A2F34] bg-[#1B1F23] text-[#F2F0EB] focus:border-zinc-500"
                  : "border-zinc-300 bg-zinc-50 text-zinc-800 focus:border-zinc-400"
              }`}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className={`flex items-center gap-1 cursor-pointer rounded-sm border px-2.5 py-1 font-mono text-xs uppercase transition-colors ${
                isDarkMode
                  ? "border-[#2A2F34] bg-[#1B1F23] text-[#6B7278] hover:border-zinc-600 hover:text-[#F2F0EB]"
                  : "border-zinc-300 bg-zinc-50 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
              }`}
              title="Sort Alphabetically"
            >
              <ArrowUpDown size={12} />
              <span>{sortOrder.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div
          className={`py-12 text-center font-mono text-xs ${
            isDarkMode ? "text-[#6B7278]" : "text-zinc-500"
          }`}
        >
          No products found.
        </div>
      ) : (
        <>
          <div
            className={`hidden items-center gap-4 border-b px-4 py-2 font-mono text-[10px] uppercase tracking-widest sm:flex ${
              isDarkMode
                ? "border-[#2A2F34] bg-[#1B1F23] text-[#6B7278]"
                : "border-zinc-200 bg-zinc-50 text-zinc-500"
            }`}
          >
            <span className="w-10" />
            <span className="flex-1">Name</span>
            <span className="w-28">Category</span>
            <span className="w-20 text-right">Price</span>
            <span className="w-16 text-right">Sold</span>
            <span className="w-16 text-right">Stock</span>
            <span className="w-24 text-right">Actions</span>
          </div>
          <div
            className={`divide-y ${
              isDarkMode ? "divide-[#2A2F34]" : "divide-zinc-200"
            }`}
          >
            {filteredProducts.map((p) => {
              const lowStock = p.stock <= 5 && p.stock > 0;
              const outOfStock = p.stock === 0;
              const soldCount = p.total_sold ?? p.totalSold ?? 0;

              return (
                <div
                  key={p.id}
                  onClick={() => openDetailsModal(p)}
                  className={`group flex items-center gap-3 px-3 py-3 transition-colors cursor-pointer sm:gap-4 sm:px-4 ${
                    isDarkMode ? "hover:bg-[#1B1F23]" : "hover:bg-zinc-50"
                  }`}
                >
                  <div
                    className={`h-10 w-10 shrink-0 overflow-hidden rounded-sm border ${
                      isDarkMode
                        ? "border-[#2A2F34] bg-zinc-950"
                        : "border-zinc-200 bg-zinc-100"
                    }`}
                  >
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <span
                    className={`min-w-0 flex-1 truncate text-sm transition-colors ${
                      isDarkMode
                        ? "text-[#F2F0EB] group-hover:text-emerald-400"
                        : "text-zinc-900 group-hover:text-emerald-600"
                    }`}
                  >
                    {p.name}
                    <span className="mt-1 block truncate font-mono text-[10px] uppercase text-zinc-500 sm:hidden">
                      {p.category} · ${Number(p.price).toFixed(2)} · {p.stock} in stock
                    </span>
                  </span>
                  <span
                    className={`hidden w-28 truncate font-mono text-xs uppercase sm:block ${
                      isDarkMode ? "text-[#6B7278]" : "text-zinc-500"
                    }`}
                  >
                    {p.category}
                  </span>
                  <span
                    className={`hidden w-20 text-right font-mono text-sm tabular-nums sm:block ${
                      isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
                    }`}
                  >
                    ${Number(p.price).toFixed(2)}
                  </span>
                  <span
                    className={`hidden w-16 text-right font-mono text-sm tabular-nums sm:block ${
                      isDarkMode ? "text-[#6B7278]" : "text-zinc-500"
                    }`}
                  >
                    {soldCount.toLocaleString()}
                  </span>
                  <span
                    className={`w-12 text-right font-mono text-sm font-semibold tabular-nums sm:w-16 ${
                      outOfStock
                        ? "text-[#C97066]"
                        : lowStock
                          ? "text-[#D1A053]"
                          : isDarkMode
                            ? "text-[#F2F0EB]"
                            : "text-zinc-900"
                    }`}
                  >
                    {p.stock}
                  </span>
                  <div
                    className="flex w-16 items-center justify-end gap-2 sm:w-24"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => openEditModal(p)}
                      className={`transition-colors ${
                        isDarkMode
                          ? "text-[#6B7278] hover:text-[#F2F0EB]"
                          : "text-zinc-400 hover:text-zinc-900"
                      }`}
                      title="Edit Product"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className={`transition-colors ${
                        isDarkMode
                          ? "text-[#6B7278] hover:text-[#C97066]"
                          : "text-zinc-400 hover:text-rose-600"
                      }`}
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight
                      size={14}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity ml-1 ${
                        isDarkMode ? "text-[#6B7278]" : "text-zinc-400"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            fetchProducts();
          }}
        />
      )}

      <ProductDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        product={selectedProductDetails}
      />
    </div>
  );
}
