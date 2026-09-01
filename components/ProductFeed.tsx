"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ui/ProductCard";
import { Loader2, PackageX } from "lucide-react";
import SubNav from "./layout/SubNav";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  alt_text: string | null;
};

export default function ProductFeed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeQuickLink, setActiveQuickLink] = useState<string | null>(null);
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
    if (selectedCategory === "all") return true;
    return product.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="w-full">
      <SubNav
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        activeQuickLink={activeQuickLink}
        setActiveQuickLink={setActiveQuickLink}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-zinc-500" />
        </div>
      ) : activeQuickLink ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
          <PackageX className="h-8 w-8 text-zinc-600" />
          <p className="font-mono text-sm font-medium text-zinc-300">
            Nothing here yet
          </p>
          <p className="font-mono text-xs text-zinc-500">
            The {activeQuickLink} section is currently under development.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
          <p className="font-mono text-sm text-zinc-500">
            No components listed under this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              stock={product.stock}
              imageUrl={product.image_url}
              altText={product.alt_text}
            />
          ))}
        </div>
      )}
    </div>
  );
}
