"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, Loader2 } from "lucide-react";
import Logo from "@/app/favicon.png";
import { usePathname } from "next/navigation";
import { RiMessage2Fill } from "react-icons/ri";

type Message = { role: "user" | "assistant"; content: string };

function FormattedText({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} className="h-1" />;

        const parts = line.split(/(\*\*.*?\*\*)/g);

        return (
          <p key={lIdx} className="leading-relaxed">
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-semibold text-emerald-400">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatWidget() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm the TechHub assistant. Need help picking hardware, checking prices, or verifying stock?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (isAdmin) {
    return null;
  }

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to fetch response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-115 w-80 sm:w-88 flex-col overflow-hidden rounded-[5px] border border-zinc-800 bg-zinc-950 shadow-2xl transition-all">
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-3.5 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Image
                src={Logo}
                alt="TechHub Logo"
                width={18}
                height={18}
                className="object-contain"
              />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                TechHub Assistant
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <X size={15} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto p-3.5 text-xs text-zinc-300"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-sm px-3 py-2 ${
                    m.role === "user"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono"
                      : "border border-zinc-800/80 bg-zinc-900/80 text-zinc-300"
                  }`}
                >
                  <FormattedText content={m.content} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-sm border border-zinc-800/80 bg-zinc-900/80 px-3 py-2 text-zinc-400">
                  <Loader2
                    size={13}
                    className="animate-spin text-emerald-400"
                  />
                  <span className="font-mono text-[11px]">
                    Searching catalog...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 w-full border-t border-zinc-800/80 bg-zinc-900/30 p-2.5">
            <div className="flex-1 flex items-center gap-2 rounded-sm border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 transition-all focus-within:border-emerald-500/50">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about stock, specs, or prices..."
                className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center rounded-[3px] text-emerald-400 transition-all hover:scale-110 active:scale-90 disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 cursor-pointer right-4 z-50 flex items-center gap-2 rounded-sm border border-emerald-500/40 bg-emerald-400 px-3.5 py-2 font-mono text-xs font-semibold text-zinc-950 shadow-lg transition-all hover:bg-emerald-300 active:scale-95"
      >
        {open ? (
          <X size={16} />
        ) : (
          <>
            <RiMessage2Fill size={23} className="animate-bounce" />
            <span>Got any questions?</span>
          </>
        )}
      </button>
    </>
  );
}
