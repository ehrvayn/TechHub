"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type CartItem = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
};

function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemIds = (searchParams.get("items") ?? "")
    .split(",")
    .filter(Boolean)
    .map(Number);

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch("/api/cart");
      const data: CartItem[] = await res.json();
      setItems(data.filter((item) => itemIds.includes(item.id)));
      setLoading(false);
    };
    fetchCart();
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacing(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItemIds: itemIds,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingPhone,
        paymentMethod,
      }),
    });

    const result = await res.json();
    setPlacing(false);

    if (result.success) {
      router.push(`/orders/${result.order.id}`);
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={20} className="animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 p-3"
          >
            <div>
              <p className="text-sm text-zinc-100">{item.name}</p>
              <p className="font-mono text-xs text-zinc-500">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
            <span className="font-mono text-sm text-zinc-100">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between border-t border-zinc-800 pt-4">
        <span className="font-mono text-sm text-zinc-400">Total</span>
        <span className="font-mono text-lg font-semibold text-zinc-50">
          ${total.toFixed(2)}
        </span>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Shipping Details
        </h3>
        <input
          placeholder="Full name"
          value={shippingName}
          onChange={(e) => setShippingName(e.target.value)}
          className="rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/50"
        />
        <input
          placeholder="Address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/50"
        />
        <input
          placeholder="City"
          value={shippingCity}
          onChange={(e) => setShippingCity(e.target.value)}
          className="rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/50"
        />
        <input
          placeholder="Phone number"
          value={shippingPhone}
          onChange={(e) => setShippingPhone(e.target.value)}
          className="rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/50"
        />
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Payment Method
        </h3>
        <label className="flex items-center gap-2 rounded-sm border border-emerald-400/50 bg-zinc-900 p-3 text-sm text-zinc-100">
          <input
            type="radio"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
            className="accent-emerald-400"
          />
          Cash on Delivery
        </label>
        <label className="flex items-center gap-2 rounded-sm border border-zinc-800 bg-zinc-900/50 p-3 text-sm text-zinc-600">
          <input type="radio" disabled className="accent-zinc-700" />
          Credit/Debit Card — unavailable
        </label>
        <label className="flex items-center gap-2 rounded-sm border border-zinc-800 bg-zinc-900/50 p-3 text-sm text-zinc-600">
          <input type="radio" disabled className="accent-zinc-700" />
          GCash — unavailable
        </label>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={placing || !shippingName || !shippingAddress || !shippingCity || !shippingPhone}
        className="w-full rounded-sm bg-emerald-400 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
      >
        {placing ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}

export default CheckoutClient;