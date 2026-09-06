"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type CartCountContextType = {
  count: number;
  itemAdded: boolean;
  refreshCount: () => Promise<void>;
};

const CartCountContext = createContext<CartCountContextType | null>(null);

export function CartCountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [itemAdded, setItemAdded] = useState(false);

  const refreshCount = async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) {
        setCount(0);
        return;
      }
      const items = await res.json();
      const total = Array.isArray(items)
        ? items.reduce((sum: number, item: any) => sum + item.quantity, 0)
        : 0;
      setCount((prevCount) => {
        if (total > prevCount) {
          setItemAdded(true);

          setTimeout(() => setItemAdded(false), 500);
        }
        return total;
      });
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    refreshCount();
  }, []);

  return (
    <CartCountContext.Provider value={{ count, refreshCount, itemAdded }}>
      {children}
    </CartCountContext.Provider>
  );
}

export function useCartCount() {
  const context = useContext(CartCountContext);
  if (!context) {
    throw new Error("useCartCount must be used within CartCountProvider");
  }
  return context;
}
