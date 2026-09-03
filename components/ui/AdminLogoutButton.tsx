import Link from "next/link";
import { LogOut } from "lucide-react";

function AdminLogoutButton() {
  return (
    <div className="mx-[-16]">
      <Link
        href="/"
        target="_blank"
        className="flex items-center border-t border-zinc-800/80 py-6 gap-3 px-8 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-900/50 hover:text-zinc-200"
      >
        <span>Log-out</span>
        <LogOut size={13} className="text-zinc-500" />
      </Link>
    </div>
  );
}

export default AdminLogoutButton;
