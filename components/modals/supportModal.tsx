"use client";

import { useState } from "react";
import { HelpCircle, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

type SupportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FAQS = [
  {
    question: "Where is my order?",
    answer: "Track active orders in real-time from your Account Dashboard > Orders page.",
  },
  {
    question: "How do I cancel or modify an order?",
    answer: "Orders can be modified or canceled within 1 hour of placement via your orders page.",
  },
  {
    question: "What is your return policy?",
    answer: "Hassle-free returns within 30 days of purchase for unused items in their original packaging.",
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3–5 business days, while expedited options arrive within 1–2 business days.",
  },
  {
    question: "Are products covered by a warranty?",
    answer: "All hardware and tech components come with a standard 1-year manufacturer warranty unless stated otherwise.",
  },
];

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { isDarkMode } = useDarkMode();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm sm:p-4 ${
        isDarkMode ? "bg-black/60" : "bg-black/40"
      }`}
    >
      <div
        className={`relative flex h-full max-h-full w-full max-w-none min-h-0 flex-col overflow-hidden font-mono shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-md sm:border ${
          isDarkMode
            ? "border-zinc-800 bg-zinc-900 text-zinc-100"
            : "border-zinc-200 bg-white text-zinc-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex shrink-0 items-center justify-between border-b px-4 py-4 sm:px-6 ${
            isDarkMode ? "border-zinc-800" : "border-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle size={18} className={isDarkMode ? "text-emerald-400" : "text-emerald-600"} />
            <h3 className="text-sm font-semibold tracking-wider uppercase">Help & Support</h3>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-5 text-xs sm:px-6">
          <p className={isDarkMode ? "text-zinc-400" : "text-zinc-600"}>
            Find answers to common questions below or contact our support team directly via email.
          </p>

          {/* Direct Channel - Email Only */}
          <div className={`pb-6 border-b ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
            <a href="mailto:support@techhub.com" className="flex items-start gap-3 group">
              <Mail size={16} className={`mt-0.5 shrink-0 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`} />
              <div>
                <span className="font-semibold block group-hover:underline">Email Support Team</span>
                <span className={`text-[11px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>support@techhub.com (Responses within 24 hours)</span>
              </div>
            </a>
          </div>

          {/* FAQs - Clean Divider List */}
          <div>
            <h4 className={`font-semibold mb-3 tracking-wide uppercase text-[10px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
              Frequently Asked Questions
            </h4>
            <div className={`divide-y ${isDarkMode ? "divide-zinc-800" : "divide-zinc-200"}`}>
              {FAQS.map((faq, index) => {
                const isExpanded = expandedFaq === index;
                return (
                  <div key={index} className="py-3">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                      className="w-full flex items-center justify-between text-left font-medium cursor-pointer group"
                    >
                      <span className={`group-hover:text-emerald-500 transition-colors ${isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}>
                        {faq.question}
                      </span>
                      {isExpanded ? <ChevronUp size={14} className="text-emerald-500 shrink-0" /> : <ChevronDown size={14} className="text-zinc-500 shrink-0" />}
                    </button>
                    {isExpanded && (
                      <p className={`mt-2 text-[11px] leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex shrink-0 items-center justify-end border-t px-4 py-4 sm:px-6 ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-950/40"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer rounded-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              isDarkMode ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700" : "bg-zinc-900 text-white hover:bg-zinc-800"
            }`}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}