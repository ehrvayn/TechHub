import { auth0 } from "@/lib/auth/auth0";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import CartClient from "@/components/cartFeed";

export default async function CartPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar showBackButton activeCart />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:px-8">
        <h1 className="font-mono mb-3 text-lg uppercase tracking-widest text-zinc-300">
          Cart
        </h1>
        <CartClient />
      </main>
      <footer className="border-t border-zinc-800/60 py-6 text-center font-mono text-xs text-zinc-600">
        © {new Date().getFullYear()} TechHub. All rights reserved.
      </footer>
    </div>
  );
}
