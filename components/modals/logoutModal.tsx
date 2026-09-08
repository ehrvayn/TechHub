"use client";

import { useState } from "react";
import { LogOut, X } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

type LogoutModalProps = {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
};

export default function LogoutModal({
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}: LogoutModalProps) {
  const { isDarkMode } = useDarkMode();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isOpen = externalIsOpen ?? internalIsOpen;
  const setIsOpen = externalSetIsOpen ?? setInternalIsOpen;
  useBodyScrollLock(isOpen);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors group ${
          isDarkMode
            ? "text-zinc-100 hover:bg-zinc-800"
            : "text-zinc-900 hover:bg-zinc-100"
        }`}
      >
        <LogOut
          size={16}
          className={
            isDarkMode
              ? "text-zinc-400 group-hover:text-zinc-100"
              : "text-zinc-500 group-hover:text-zinc-900"
          }
        />
        <span>Log out</span>
      </button>

      {isOpen && (
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm sm:px-4 ${
            isDarkMode ? "bg-black/60" : "bg-black/40"
          }`}
        >
          <div
            className={`h-full max-h-full w-full max-w-none border-0 p-4 shadow-2xl sm:h-auto sm:max-w-sm sm:rounded-md sm:border sm:p-5 ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-900"
                : "border-zinc-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <h2
                className={`text-sm font-medium ${
                  isDarkMode ? "text-zinc-100" : "text-zinc-900"
                }`}
              >
                Log out of TechHub?
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`cursor-pointer ${
                  isDarkMode
                    ? "text-zinc-400 hover:text-zinc-200"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <X size={16} />
              </button>
            </div>

            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              You&apos;ll need to sign in again to view your cart and orders.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className={`cursor-pointer rounded-sm border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                  isDarkMode
                    ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Cancel
              </button>
              <a
                href="/auth/logout"
                onClick={(e) => {
                  if (isLoggingOut) {
                    e.preventDefault();
                    return;
                  }
                  setIsLoggingOut(true);
                }}
                aria-disabled={isLoggingOut}
                className={`${
                  isLoggingOut
                    ? "pointer-events-none opacity-60"
                    : "cursor-pointer"
                } rounded-sm bg-red-500/90 px-3.5 py-1.5 text-center font-mono text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-red-500 ${
                  isDarkMode ? "text-zinc-950" : "text-white"
                }`}
              >
                {isLoggingOut ? "Logging out…" : "Log Out"}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
