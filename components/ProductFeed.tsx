"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Fuse from "fuse.js";
import ProductCard from "./ui/ProductCard";
import { Loader2, X } from "lucide-react";
import SubNav from "./layout/SubNav";
import { useDarkMode } from "@/context/DarkModeContext";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  alt_text: string | null;
  avg_rating?: number;
  review_count?: number;
  created_at?: string;
  total_sold?: number;
};

export default function ProductFeed() {
  const { isDarkMode } = useDarkMode();
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search")?.trim() || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeQuickLink, setActiveQuickLink] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: [
        { name: "name", weight: 0.7 },
        { name: "category", weight: 0.3 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
    });
  }, [products]);

  const searchedProducts = useMemo(() => {
    if (!searchQuery) return products;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, products, fuse]);

  const filteredProducts = searchedProducts.filter((product) => {
    if (activeQuickLink === "New Arrivals" || activeQuickLink === "Bestsellers")
      return true;
    if (selectedCategory === "all") return true;
    return product.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeQuickLink === "New Arrivals") {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA || b.id - a.id;
    }
    if (activeQuickLink === "Bestsellers" || sortBy === "top-sold") {
      return (Number(b.total_sold) || 0) - (Number(a.total_sold) || 0);
    }
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  const displayedProducts =
    activeQuickLink === "New Arrivals" || activeQuickLink === "Bestsellers"
      ? sortedProducts.slice(0, 10)
      : sortedProducts;

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-56">
        <SubNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeQuickLink={activeQuickLink}
          setActiveQuickLink={setActiveQuickLink}
          totalItems={displayedProducts.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </aside>

      <div className="flex-1 space-y-4">
        {searchQuery && (
          <div
            className={`flex items-center justify-between rounded-md border px-3.5 py-2 font-mono text-xs ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-900/60 text-zinc-300"
                : "border-zinc-200 bg-zinc-50 text-zinc-700"
            }`}
          >
            <span>
              Results for:{" "}
              <strong className="text-emerald-400">"{searchQuery}"</strong>
            </span>
            <button
              onClick={clearSearch}
              className="flex items-center cursor-pointer gap-1 text-zinc-500 transition-colors hover:text-zinc-200"
            >
              <X size={14} />
              <span>Clear</span>
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="animate-spin text-zinc-500" />
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
            <p className="font-mono text-sm text-zinc-500">
              {searchQuery
                ? `No components found matching "${searchQuery}".`
                : "No components listed here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                name={product.name}
                price={product.price}
                category={product.category}
                stock={product.stock}
                imageUrl={product.image_url}
                altText={product.alt_text}
                avgRating={Number(product.avg_rating) || 0}
                reviewCount={Number(product.review_count) || 0}
                totalSold={Number(product.total_sold)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
