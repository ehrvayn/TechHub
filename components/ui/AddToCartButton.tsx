"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartCount } from "@/context/CartCountContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { FaCartShopping } from "react-icons/fa6";

type AddToCartButtonProps = {
  productId: number;
  stock: number;
};

function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const { isDarkMode } = useDarkMode();
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
    "idle",
  );
  const router = useRouter();
  const { refreshCount } = useCartCount();

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
    await refreshCount();
    router.refresh();
    setTimeout(() => setStatus("idle"), 1500);
  };

  if (stock === 0) {
    return (
      <button
        disabled
        className={`w-full cursor-not-allowed rounded-sm border py-2 font-mono text-xs uppercase tracking-wide ${
          isDarkMode
            ? "border-zinc-800 text-zinc-600 bg-zinc-900/50"
            : "border-zinc-200 text-zinc-400 bg-zinc-100"
        }`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={status === "loading"}
      className={`flex w-full items-center cursor-pointer justify-center gap-1.5 rounded-sm border py-2 font-mono text-xs uppercase tracking-wide transition-colors disabled:opacity-60 ${
        isDarkMode
          ? "border-emerald-400/80 bg-emerald-400/60 text-zinc-100 hover:bg-emerald-400/30 hover:border-emerald-400/40"
          : "border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600"
      }`}
    >
      {status === "loading" && <Loader2 size={13} className="animate-spin" />}
      {status === "added" && (
        <Check
          size={13}
          className={isDarkMode ? "text-emerald-400" : "text-white"}
        />
      )}
      {status === "idle" && <FaCartShopping size={13} />}
      {status === "added"
        ? "Added"
        : status === "error"
          ? "Try again"
          : "Add to Cart"}
    </button>
  );
}

export default AddToCartButton;
