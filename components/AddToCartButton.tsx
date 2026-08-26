"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type AddToCartButtonProps = {
  productId: number;
  stock: number;
};

function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
    "idle",
  );
  const router = useRouter();

  const handleAdd = async () => {
    setStatus("loading");

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (res.status === 401) {
      router.push("/auth/login");
      return;
    }

    if (!res.ok) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1500);
      return;
    }

    setStatus("added");
    router.refresh();
    setTimeout(() => setStatus("idle"), 1500);
  };

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-sm border border-zinc-800 py-2 font-mono text-xs uppercase tracking-wide text-zinc-600"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={status === "loading"}
      className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-700 py-2 font-mono text-xs uppercase tracking-wide text-zinc-300 transition-colors hover:border-emerald-400/50 hover:text-emerald-400 disabled:opacity-60"
    >
      {status === "loading" && <Loader2 size={13} className="animate-spin" />}
      {status === "added" && <Check size={13} className="text-emerald-400" />}
      {status === "idle" && <ShoppingCart size={13} />}
      {status === "added"
        ? "Added"
        : status === "error"
          ? "Try again"
          : "Add to Cart"}
    </button>
  );
}

export default AddToCartButton;
