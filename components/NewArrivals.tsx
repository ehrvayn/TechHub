"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      const sorted = data
        .sort(
          (a: Product, b: Product) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
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
          className="rounded border border-zinc-800 bg-zinc-900 p-4"
        >
          <p className="text-xs font-mono text-zinc-500 uppercase">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-zinc-100 mt-2">
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
