import { ShoppingCart, Search, Menu } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <h1 className="font-mono text-lg font-bold tracking-tight text-zinc-50">
          TechHub
        </h1>

        <div className="flex items-center gap-5 text-zinc-400">
          <Search
            size={20}
            className="cursor-pointer transition-colors hover:text-zinc-100"
          />
          <ShoppingCart
            size={20}
            className="cursor-pointer transition-colors hover:text-zinc-100"
          />
          <Menu
            size={20}
            className="cursor-pointer transition-colors hover:text-zinc-100"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
