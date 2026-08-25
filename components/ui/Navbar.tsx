import { ShoppingCart, Search } from "lucide-react";
import { auth0 } from "@/lib/auth0";
import { syncUser } from "@/lib/services/userService";
import LogoutModal from "@/components/modals/logoutModal";

const Navbar = async () => {
  const session = await auth0.getSession();

  if (session) {
    await syncUser(session.user);
  }

  const initials = session?.user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <h1 className="font-mono text-lg font-bold tracking-tight text-zinc-50">
          TechHub
        </h1>

        <div className="flex items-center gap-5">
          <Search
            size={20}
            className="cursor-pointer text-zinc-400 transition-colors hover:text-zinc-100"
          />
          <ShoppingCart
            size={20}
            className="cursor-pointer text-zinc-400 transition-colors hover:text-zinc-100"
          />

          <div className="h-5 w-px bg-zinc-800" />

          {session ? (
            <div className="flex items-center gap-3">
              {session.user.picture ? (
                <img
                  src={session.user.picture}
                  alt={session.user.name ?? "Account"}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-full border border-zinc-700"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 font-mono text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/30">
                  {initials || "U"}
                </div>
              )}
              <LogoutModal />
            </div>
          ) : (
            <a
              href="/auth/login"
              className="rounded-sm bg-emerald-400 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-emerald-300"
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
