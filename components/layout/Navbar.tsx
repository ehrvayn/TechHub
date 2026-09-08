import { ArrowLeft } from "lucide-react";
import { auth0 } from "@/lib/auth/auth0";
import { syncUser } from "@/lib/services/userService";
import Link from "next/link";
import Logo from "../../public/img/Logo.png";
import ProfileMenu from "../ui/ProfileMenu";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import CartIconWithBadge from "@/components/ui/CartIconWithBadge";
import SearchBar from "@/components/ui/Searchbar";
import NotificationMenu from "@/components/ui/NotificationMenu";

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
    <nav className="sticky top-0 z-50 border-b border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-350 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 sm:flex-nowrap sm:px-8">
        <div className="flex shrink-0 items-center gap-3">
          {showBackButton && (
            <Link
              href="/"
              className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
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

        <SearchBar />

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <div className="flex gap-5">
            <div className="flex items-center gap-5">
              <CartIconWithBadge activeCart={activeCart} />
              <NotificationMenu userId={currentUser?.id} />
            </div>
          </div>

          <div className="hidden h-[55] -my-2 w-px bg-zinc-300 dark:bg-zinc-800 sm:block" />

          {session ? (
            <ProfileMenu
              session={session}
              initials={initials || "U"}
              role={currentUser?.role}
            />
          ) : (
            <a
              href="/auth/login"
              className="rounded-[2] bg-emerald-400 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-emerald-300"
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
