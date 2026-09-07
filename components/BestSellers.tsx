"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  created_at: string;
  image_url: string | null;
  total_sold?: number;
};

export default function Bestsellers() {
  const { isDarkMode } = useDarkMode();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      const sorted = data
        .sort(
          (a: Product, b: Product) => (b.total_sold || 0) - (a.total_sold || 0),
        )
        .slice(0, 10);
      setProducts(sorted);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={24} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className={`rounded border p-4 ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-zinc-200 bg-white"
          }`}
        >
          <p className="text-xs font-mono text-zinc-500 uppercase">
            {product.category}
          </p>
          <h3
            className={`text-sm font-medium mt-2 ${
              isDarkMode ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            {product.name}
          </h3>
          <p className="text-emerald-400 font-mono text-sm mt-1">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}
