import Navbar from "@/components/layout/Navbar";
import ProductFeed from "@/components/ProductFeed";
import { HeroBanner } from "@/components/HeroBanner";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 dark:bg-zinc-950">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <HeroBanner />
        <ProductFeed />
      </main>

      <footer className="border-t border-zinc-300/60 py-6 text-center font-mono text-xs text-zinc-500 dark:border-zinc-800/60 dark:text-zinc-600">
        © {new Date().getFullYear()} TechHub. All rights reserved.
      </footer>
    </div>
  );
}