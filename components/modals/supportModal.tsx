"use client";

import { HelpCircle, X, Mail, MessageSquare } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

type SupportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { isDarkMode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
        isDarkMode ? "bg-black/60" : "bg-black/40"
      }`}
    >
      <div
        className={`relative w-full max-w-md rounded-md border p-6 font-mono shadow-xl ${
          isDarkMode
            ? "border-zinc-800 bg-zinc-900 text-zinc-100"
            : "border-zinc-200 bg-white text-zinc-900"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b pb-3 ${
            isDarkMode ? "border-zinc-800" : "border-zinc-200"
          }`}
        >
          <h3
            className={`flex items-center gap-2 text-base font-semibold ${
              isDarkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            <HelpCircle
              size={18}
              className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}
            />
            Help & Support
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer ${
              isDarkMode
                ? "text-zinc-400 hover:text-white"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <p className={isDarkMode ? "text-zinc-400" : "text-zinc-600"}>
            Need assistance with your order or have questions? Contact our
            support team below.
          </p>

          <a
            href="mailto:support@techhub.com"
            className={`flex items-center gap-3 rounded-md border p-3 transition-colors ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800"
                : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100"
            }`}
          >
            <Mail
              size={18}
              className={`shrink-0 ${
                isDarkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
            <div>
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                Email Support
              </p>
              <p
                className={`text-[11px] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                support@techhub.com
              </p>
            </div>
          </a>

          <div
            className={`flex items-center gap-3 rounded-md border p-3 ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-800/50"
                : "border-zinc-200 bg-zinc-50"
            }`}
          >
            <MessageSquare
              size={18}
              className={`shrink-0 ${
                isDarkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
            <div>
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                Live Chat
              </p>
              <p
                className={`text-[11px] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Available via the chat widget at the bottom right
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer rounded-md border px-4 py-1.5 text-xs font-semibold transition-colors ${
              isDarkMode
                ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                : "border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
