import Navbar from "@/components/layout/Navbar";
import ProductFeed from "@/components/ProductFeed";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 sm:px-8">
        <div className="mb-8 flex items-baseline justify-between border-b border-zinc-800 pb-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Catalog
          </h2>
          <span className="font-mono text-xs text-zinc-600">All parts</span>
        </div>
        <ProductFeed />
      </main>
    </div>
  );
}
