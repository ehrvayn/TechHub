"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ShieldCheck, MapPin, Truck, AlertCircle } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

type CartItem = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
};

function CheckoutClient() {
  const { isDarkMode } = useDarkMode();
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemIds = (searchParams.get("items") ?? "")
    .split(",")
    .filter(Boolean)
    .map(Number);

  const paymentStatus = searchParams.get("payment");

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    paymentStatus === "cancelled"
      ? "Payment was cancelled. Please try again."
      : null,
  );

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

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = 0.0;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setErrorMessage(null);

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

    if (!result.success) {
      setPlacing(false);
      setErrorMessage(result.message || "Failed to create order.");
      return;
    }

    if (paymentMethod === "gcash" || paymentMethod === "card") {
      const paymongoRes = await fetch("/api/paymongo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          orderId: result.order.id,
        }),
      });

      const paymongoResult = await paymongoRes.json();
      setPlacing(false);

      if (paymongoResult.success && paymongoResult.checkoutUrl) {
        window.location.href = paymongoResult.checkoutUrl;
        return;
      } else {
        setErrorMessage(
          paymongoResult.message || "Failed to initialize payment gateway.",
        );
        return;
      }
    }

    setPlacing(false);
    router.push(`/orders/${result.order.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={24} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div
      className={`mx-auto max-w-6xl py-6 font-mono text-xs sm:py-8 ${
        isDarkMode ? "text-zinc-300" : "text-zinc-700"
      }`}
    >
      {errorMessage && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-sm border p-3.5 ${
            isDarkMode
              ? "border-red-500/40 bg-red-950/30 text-red-400"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-8 lg:col-span-7">
          <div className="space-y-4">
            <div
              className={`flex items-center gap-2 font-medium ${
                isDarkMode ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              <MapPin size={15} className="text-emerald-400" />
              <span>Shipping Information</span>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Full name"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                className={`w-full rounded-sm border px-3.5 py-2.5 text-xs outline-none transition-colors focus:border-emerald-400/50 ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-950 text-zinc-100"
                    : "border-zinc-200 bg-white text-zinc-900"
                }`}
              />
              <input
                placeholder="Street Address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className={`w-full rounded-sm border px-3.5 py-2.5 text-xs outline-none transition-colors focus:border-emerald-400/50 ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-950 text-zinc-100"
                    : "border-zinc-200 bg-white text-zinc-900"
                }`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  placeholder="City"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className={`w-full rounded-sm border px-3.5 py-2.5 text-xs outline-none transition-colors focus:border-emerald-400/50 ${
                    isDarkMode
                      ? "border-zinc-800 bg-zinc-950 text-zinc-100"
                      : "border-zinc-200 bg-white text-zinc-900"
                  }`}
                />
                <input
                  placeholder="Phone number"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className={`w-full rounded-sm border px-3.5 py-2.5 text-xs outline-none transition-colors focus:border-emerald-400/50 ${
                    isDarkMode
                      ? "border-zinc-800 bg-zinc-950 text-zinc-100"
                      : "border-zinc-200 bg-white text-zinc-900"
                  }`}
                />
              </div>
            </div>
          </div>

          <div
            className={`space-y-4 pt-4 border-t ${
              isDarkMode ? "border-zinc-800/60" : "border-zinc-200"
            }`}
          >
            <div
              className={`flex items-center gap-2 font-medium ${
                isDarkMode ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              <ShieldCheck size={15} className="text-emerald-400" />
              <span>Payment Method</span>
            </div>
            <div className="space-y-2">
              <label
                className={`flex items-center gap-3 rounded-sm border px-3.5 py-3 text-xs cursor-pointer transition-colors ${
                  paymentMethod === "cod"
                    ? `border-emerald-400/50 ${
                        isDarkMode
                          ? "bg-zinc-950 text-zinc-100"
                          : "bg-white text-zinc-900"
                      }`
                    : `${
                        isDarkMode
                          ? "border-zinc-800 bg-zinc-950/40 text-zinc-400"
                          : "border-zinc-200 bg-zinc-50 text-zinc-600"
                      }`
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-emerald-400"
                />
                <div className="flex flex-col">
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-zinc-100" : "text-zinc-900"
                    }`}
                  >
                    Cash on Delivery
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    Pay upon order receipt
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 rounded-sm border px-3.5 py-3 text-xs cursor-pointer transition-colors ${
                  paymentMethod === "gcash"
                    ? `border-emerald-400/50 ${
                        isDarkMode
                          ? "bg-zinc-950 text-zinc-100"
                          : "bg-white text-zinc-900"
                      }`
                    : `${
                        isDarkMode
                          ? "border-zinc-800 bg-zinc-950/40 text-zinc-400"
                          : "border-zinc-200 bg-zinc-50 text-zinc-600"
                      }`
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "gcash"}
                  onChange={() => setPaymentMethod("gcash")}
                  className="accent-emerald-400"
                />
                <div className="flex flex-col">
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-zinc-100" : "text-zinc-900"
                    }`}
                  >
                    GCash / Maya (PayMongo)
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    Pay securely online via redirect
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 rounded-sm border px-3.5 py-3 text-xs cursor-pointer transition-colors ${
                  paymentMethod === "card"
                    ? `border-emerald-400/50 ${
                        isDarkMode
                          ? "bg-zinc-950 text-zinc-100"
                          : "bg-white text-zinc-900"
                      }`
                    : `${
                        isDarkMode
                          ? "border-zinc-800 bg-zinc-950/40 text-zinc-400"
                          : "border-zinc-200 bg-zinc-50 text-zinc-600"
                      }`
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-emerald-400"
                />
                <div className="flex flex-col">
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-zinc-100" : "text-zinc-900"
                    }`}
                  >
                    Credit / Debit Card (PayMongo)
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    Visa, Mastercard via redirect
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div
          className={`space-y-6 lg:col-span-5 lg:border-l lg:pl-10 ${
            isDarkMode ? "lg:border-zinc-800/60" : "lg:border-zinc-200"
          }`}
        >
          <div className="space-y-4">
            <div
              className={`flex items-center gap-2 font-medium ${
                isDarkMode ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              <Truck size={15} className="text-emerald-400" />
              <span>Review Items ({items.length})</span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 py-2.5 border-b last:border-0 ${
                    isDarkMode ? "border-zinc-800/40" : "border-zinc-200"
                  }`}
                >
                  <div
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border ${
                      isDarkMode
                        ? "bg-zinc-950 border-zinc-800"
                        : "bg-zinc-100 border-zinc-200"
                    }`}
                  >
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[9px] text-zinc-500 uppercase">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center min-w-0">
                    <p
                      className={`truncate text-xs font-medium ${
                        isDarkMode ? "text-zinc-200" : "text-zinc-800"
                      }`}
                    >
                      {item.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-xs font-semibold shrink-0 ${
                      isDarkMode ? "text-zinc-100" : "text-zinc-900"
                    }`}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className={`space-y-2 pt-3 border-t font-mono text-xs ${
                isDarkMode ? "border-zinc-800" : "border-zinc-200"
              }`}
            >
              <div
                className={
                  isDarkMode
                    ? "flex justify-between text-zinc-400"
                    : "flex justify-between text-zinc-600"
                }
              >
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div
                className={
                  isDarkMode
                    ? "flex justify-between text-zinc-400"
                    : "flex justify-between text-zinc-600"
                }
              >
                <span>Shipping</span>
                <span className="text-emerald-400">Free</span>
              </div>
              <div
                className={`flex justify-between border-t pt-3 text-sm font-bold ${
                  isDarkMode
                    ? "border-zinc-800 text-zinc-50"
                    : "border-zinc-200 text-zinc-900"
                }`}
              >
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={
                placing ||
                !shippingName ||
                !shippingAddress ||
                !shippingCity ||
                !shippingPhone
              }
              className={`w-full flex items-center justify-center gap-2 rounded-sm bg-emerald-400 py-3 font-mono text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed cursor-pointer mt-4 ${
                isDarkMode
                  ? "text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-600"
                  : "text-zinc-950 disabled:bg-zinc-200 disabled:text-zinc-400"
              }`}
            >
              {placing && <Loader2 size={14} className="animate-spin" />}
              {placing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutClient;
