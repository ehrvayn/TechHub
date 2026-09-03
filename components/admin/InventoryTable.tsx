"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import ProductFormModal from "./ProductFormModal";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: string;
  category_id?: number;
  image_url: string | null;
};

export default function InventoryTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
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

  const openAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  const filteredProducts = products
    .filter((p) => selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase())
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === "asc") return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
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
    <div className="overflow-hidden rounded-[4] border border-[#2A2F34] bg-zinc-800/20">
      <div className="flex flex-col gap-3 border-b border-[#2A2F34] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-[#6B7278]">
            Products ({filteredProducts.length})
          </h2>

          <div className="flex items-center gap-1.5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-sm border cursor-pointer border-[#2A2F34] bg-[#1B1F23] px-2.5 py-1 font-mono text-xs uppercase text-[#F2F0EB] focus:border-zinc-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              className="flex items-center gap-1 cursor-pointer rounded-sm border border-[#2A2F34] bg-[#1B1F23] px-2.5 py-1 font-mono text-xs uppercase text-[#6B7278] transition-colors hover:border-zinc-600 hover:text-[#F2F0EB]"
              title="Sort Alphabetically"
            >
              <ArrowUpDown size={12} />
              <span>{sortOrder.toUpperCase()}</span>
            </button>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center cursor-pointer gap-1.5 rounded-sm bg-emerald-400 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-emerald-300"
        >
          <Plus size={13} />
          New product
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center font-mono text-xs text-[#6B7278]">
          No products found.
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 border-b border-[#2A2F34] bg-[#1B1F23] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#6B7278]">
            <span className="w-10" />
            <span className="flex-1">Name</span>
            <span className="w-28">Category</span>
            <span className="w-20 text-right">Price</span>
            <span className="w-20 text-right">Stock</span>
            <span className="w-20 text-right">Actions</span>
          </div>
          <div className="divide-y divide-[#2A2F34]">
            {filteredProducts.map((p) => {
              const lowStock = p.stock <= 5 && p.stock > 0;
              const outOfStock = p.stock === 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#1B1F23]"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-[#2A2F34] bg-zinc-950">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="flex-1 truncate text-sm text-[#F2F0EB]">
                    {p.name}
                  </span>
                  <span className="w-28 truncate font-mono text-xs uppercase text-[#6B7278]">
                    {p.category}
                  </span>
                  <span className="w-20 text-right font-mono text-sm tabular-nums text-[#F2F0EB]">
                    ${Number(p.price).toFixed(2)}
                  </span>
                  <span
                    className={`w-20 text-right font-mono text-sm font-semibold tabular-nums ${
                      outOfStock
                        ? "text-[#C97066]"
                        : lowStock
                        ? "text-[#D1A053]"
                        : "text-[#F2F0EB]"
                    }`}
                  >
                    {p.stock}
                  </span>
                  <div className="flex w-20 justify-end gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-[#6B7278] transition-colors hover:text-[#F2F0EB]"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-[#6B7278] transition-colors hover:text-[#C97066]"
                    >
                      <Trash2 size={14} />
                    </button>
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
    </div>
  );
}