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
      <div className="relative mx-auto flex w-full max-w-350 flex-col px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 sm:px-8">
        <div className="flex w-full items-center justify-between sm:w-auto">
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

          <div className="sm:absolute sm:inset-y-0 sm:right-8 sm:flex sm:items-center">
            {session ? (
              <ProfileMenu
                session={session}
                initials={initials || "U"}
                role={currentUser?.role}
              />
            ) : (
              <a
                href="/auth/login"
                className="rounded-[2px] bg-emerald-400 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-zinc-950"
              >
                Sign In
              </a>
            )}
          </div>
        </div>

        <div className="flex w-full items-center gap-3 pt-2 sm:contents sm:pt-0">
          <SearchBar />

          <div className="flex shrink-0 items-center gap-4 sm:gap-5 sm:pr-28">
            <div className="flex items-center gap-4 sm:gap-5">
              <CartIconWithBadge activeCart={activeCart} />
              <NotificationMenu userId={currentUser?.id} />
            </div>

            <div className="hidden h-[55] -my-2 w-px bg-zinc-300 dark:bg-zinc-800 sm:block" />

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
