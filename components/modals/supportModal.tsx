"use client";

import { HelpCircle, X, Mail, MessageSquare } from "lucide-react";

type SupportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-md border border-zinc-800 bg-zinc-900 p-6 font-mono text-zinc-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-white">
            <HelpCircle size={18} className="text-emerald-400" />
            Help & Support
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-zinc-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <p className="text-zinc-400">
            Need assistance with your order or have questions? Contact our
            support team below.
          </p>

          <a
            href="mailto:support@techhub.com"
            className="flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-800/50 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
          >
            <Mail size={18} className="shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold text-white">Email Support</p>
              <p className="text-[11px] text-zinc-400">support@techhub.com</p>
            </div>
          </a>

          <div className="flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-800/50 p-3">
            <MessageSquare size={18} className="shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold text-white">Live Chat</p>
              <p className="text-[11px] text-zinc-400">
                Available via the chat widget at the bottom right
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-zinc-700 bg-zinc-800 px-4 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
