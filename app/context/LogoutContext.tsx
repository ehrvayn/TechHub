"use client";

import React, { createContext, useContext, useState } from "react";
import { X } from "lucide-react";

type LogoutContextType = {
  openLogout: () => void;
  closeLogout: () => void;
};

const LogoutContext = createContext<LogoutContextType | null>(null);

export function LogoutProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const openLogout = () => setIsOpen(true);
  const closeLogout = () => {
    setIsOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <LogoutContext.Provider value={{ openLogout, closeLogout }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-md border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-start justify-between">
              <h2 className="text-sm font-medium text-zinc-100">
                Log out of TechHub?
              </h2>
              <button
                onClick={closeLogout}
                className="text-zinc-500 cursor-pointer hover:text-zinc-300"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              You&apos;ll need to sign in again to view your cart and orders.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeLogout}
                className="rounded-sm cursor-pointer border border-zinc-700 px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide text-zinc-300 transition-colors hover:bg-zinc-800"
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
                } rounded-sm bg-red-500/90 px-3.5 py-1.5 text-center font-mono text-xs font-semibold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-red-500`}
              >
                {isLoggingOut ? "Logging out…" : "Log Out"}
              </a>
            </div>
          </div>
        </div>
      )}
    </LogoutContext.Provider>
  );
}

export function useLogout() {
  const context = useContext(LogoutContext);
  if (!context) {
    throw new Error("useLogout must be used within LogoutProvider");
  }
  return context;
}
