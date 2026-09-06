import { Search, ArrowLeft } from "lucide-react";
import { auth0 } from "@/lib/auth/auth0";
import { syncUser } from "@/lib/services/userService";
import Link from "next/link";
import Logo from "../../public/img/Logo.png";
import ProfileMenu from "../ui/ProfileMenu";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import CartIconWithBadge from "@/components/ui/CartIconWithBadge";

type NavbarProps = {
  showBackButton?: boolean;
  activeCart?: boolean;
};

const Navbar = async ({
  showBackButton = false,
  activeCart = false,
}: NavbarProps) => {
  const session = await auth0.getSession();

  if (session) {
    await syncUser(session.user);
  }

  const currentUser = session ? await getCurrentUser() : null;

  const initials = session?.user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex w-full max-w-350 items-center justify-between gap-4 px-6 py-2.5 sm:px-8">
        <div className="flex shrink-0 items-center gap-3">
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
              className="h-10 w-auto cursor-pointer"
            />
          </Link>
        </div>

        <div className="relative mx-4 flex flex-1 max-w-md items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={16} className="text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/80 py-2 pl-9 pr-4 font-mono text-xs text-zinc-100 placeholder:text-zinc-500 transition-all focus:border-zinc-700 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
          />
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <div className="flex items-center gap-5">
            <CartIconWithBadge activeCart={activeCart} />

            <div className="h-8 w-px bg-zinc-800" />
          </div>

          {session ? (
            <ProfileMenu
              session={session}
              initials={initials || "U"}
              role={currentUser?.role}
            />
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
