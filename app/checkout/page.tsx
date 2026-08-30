import Navbar from "@/components/layout/Navbar";
import CheckoutClient from "@/components/CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar showBackButton />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-8">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
          Checkout
        </h2>
        <CheckoutClient />
      </main>
    </div>
  );
}
