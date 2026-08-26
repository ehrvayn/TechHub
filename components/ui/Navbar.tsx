import { ShoppingCart, Search, ArrowLeft } from "lucide-react";
import { auth0 } from "@/lib/auth0";
import { syncUser } from "@/lib/services/userService";
import LogoutModal from "@/components/modals/logoutModal";
import Link from "next/link";
import Logo from "../../public/img/Logo.png";

type NavbarProps = {
  showBackButton?: boolean;
};

const Navbar = async ({ showBackButton = false }: NavbarProps) => {
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
      <div
        className={`max-w-350 mx-auto flex w-full  items-center justify-between px-6 py-2 sm:px-8`}
      >
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Link
              href="/"
              className="text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <ArrowLeft size={25} />
            </Link>
          )}
          <Link href="/">
            <img
              src={Logo.src}
              alt="TechHub Logo"
              className="h-10 cursor-pointer w-auto"
            />
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <div
            className={`${showBackButton ? "gap-4" : "gap-5"} flex items-center`}
          >
            <Search
              size={20}
              className="cursor-pointer text-zinc-400 transition-colors hover:text-zinc-100"
            />
            <Link href="/cart">
              <ShoppingCart
                size={showBackButton ? 28 : 20}
                className={`${showBackButton ? "text-green-400" : "text-zinc-400"} cursor-pointer  transition-colors hover:text-zinc-100`}
              />
            </Link>
            <div className="h-5 w-px bg-zinc-800" />
          </div>

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
