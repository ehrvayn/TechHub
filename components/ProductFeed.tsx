"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ui/ProductCard";
import { Loader2 } from "lucide-react";
import SubNav from "./layout/SubNav";
import { CatalogHeader } from "./ui/CatalogHeader";

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

  const filteredProducts = products.filter((product) => {
    if (activeQuickLink === "New Arrivals") return true;
    if (activeQuickLink === "Bestsellers") return true;
    if (selectedCategory === "all") return true;
    return product.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeQuickLink === "New Arrivals") {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA || b.id - a.id;
    }

    if (activeQuickLink === "Bestsellers") {
      return (Number(b.total_sold) || 0) - (Number(a.total_sold) || 0);
    }

    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    if (sortBy === "top-sold") {
      return (Number(b.total_sold) || 0) - (Number(a.total_sold) || 0);
    }

    return 0;
  });

  const displayedProducts =
    activeQuickLink === "New Arrivals" || activeQuickLink === "Bestsellers"
      ? sortedProducts.slice(0, 10)
      : sortedProducts;

  return (
    <div className="w-full space-y-6">
      <SubNav
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        activeQuickLink={activeQuickLink}
        setActiveQuickLink={setActiveQuickLink}
      />

      <CatalogHeader
        totalItems={displayedProducts.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-zinc-500" />
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
          <p className="font-mono text-sm text-zinc-500">
            No components listed here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
  );
}
