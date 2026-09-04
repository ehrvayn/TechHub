import Navbar from "@/components/layout/Navbar";
import ProductFeed from "@/components/ProductFeed";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 sm:px-8">
        <ProductFeed />
      </main>
      <footer className="border-t border-zinc-800/60 py-6 text-center font-mono text-xs text-zinc-600">
        © {new Date().getFullYear()} TechHub. All rights reserved.
      </footer>
    </div>
  );
}