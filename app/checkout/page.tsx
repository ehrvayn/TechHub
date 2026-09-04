import Navbar from "@/components/layout/Navbar";
import CheckoutClient from "@/components/CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar showBackButton />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 sm:px-8">
        <h1 className="font-mono text-lg uppercase tracking-widest text-zinc-300">
          Checkout
        </h1>
        <CheckoutClient />
      </main>
      <footer className="border-t border-zinc-800/60 py-6 text-center font-mono text-xs text-zinc-600">
        © {new Date().getFullYear()} TechHub. All rights reserved.
      </footer>
    </div>
  );
}
