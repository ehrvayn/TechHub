import { auth0 } from "@/lib/auth0";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { getOrderDetail } from "@/lib/services/orderService";
import pool from "@/lib/database/db";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

async function getCurrentUserId(): Promise<number | null> {
  const session = await auth0.getSession();
  if (!session) return null;

  const result = await pool.query("SELECT id FROM users WHERE auth0_id = $1", [
    session.user.sub,
  ]);
  return result.rows[0]?.id ?? null;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth0.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/auth/login");
  }

  const result = await getOrderDetail(Number(id), userId);

  if (!result.success || !result.order || !result.items) {
    notFound();
  }

  const { order, items } = result;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar showBackButton />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-8">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <CheckCircle size={40} className="text-emerald-400" />
          <h2 className="text-lg font-semibold text-zinc-100">Order Placed</h2>
          <p className="font-mono text-xs text-zinc-500">Order #{order.id}</p>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 p-3"
            >
              <div>
                <p className="text-sm text-zinc-100">{item.product_name}</p>
                <p className="font-mono text-xs text-zinc-500">
                  ${Number(item.price).toFixed(2)} x {item.quantity}
                </p>
              </div>
              <span className="font-mono text-sm text-zinc-100">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between border-t border-zinc-800 pt-4">
          <span className="font-mono text-sm text-zinc-400">Total</span>
          <span className="font-mono text-lg font-semibold text-zinc-50">
            ${Number(order.total).toFixed(2)}
          </span>
        </div>

        <div className="mb-6 flex flex-col gap-2 rounded-md border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Shipping To
          </h3>
          <p className="text-sm text-zinc-100">{order.shipping_name}</p>
          <p className="text-sm text-zinc-400">{order.shipping_address}</p>
          <p className="text-sm text-zinc-400">{order.shipping_city}</p>
          <p className="text-sm text-zinc-400">{order.shipping_phone}</p>
          <p className="mt-2 font-mono text-xs uppercase text-zinc-500">
            Payment:{" "}
            {order.payment_method === "cod"
              ? "Cash on Delivery"
              : order.payment_method}
          </p>
          <p className="font-mono text-xs uppercase text-zinc-500">
            Status: {order.status}
          </p>
        </div>

        <Link
          href="/orders"
          className="block w-full rounded-sm border border-zinc-700 py-2.5 text-center font-mono text-xs uppercase tracking-wide text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
        >
          View All Orders
          <ArrowRight size={16} className="ml-2 inline-block" />
        </Link>
      </main>
    </div>
  );
}
