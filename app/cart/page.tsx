import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import CartClient from "@/components/cartClient";

export default async function CartPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar showBackButton />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:px-8">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
          Your Cart
        </h2>
        <CartClient />
      </main>
    </div>
  );
}
