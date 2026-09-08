"use client";

import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import { useDarkMode } from "@/context/DarkModeContext";

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 30) {
    return "just now";
  }
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins}m ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function NotificationMenu({ userId }: { userId?: number }) {
  const { isDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { unreadCount, refreshUnreadCount } = useNotification();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?limit=10`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen((prev) => !prev);
  };

  const handleMarkAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );

    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (res.ok) {
        refreshUnreadCount();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      const res = await fetch(`/api/notifications/read-all`, {
        method: "PATCH",
      });
      if (res.ok) {
        refreshUnreadCount();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = (item: Notification) => {
    if (!item.is_read) {
      handleMarkAsRead(item.id);
    }
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative mt-1 cursor-pointer transition-colors ${
          isDarkMode
            ? "text-zinc-400 hover:text-zinc-100"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`fixed right-3 top-24 z-50 mt-3 w-[min(20rem,calc(100vw-1.5rem))] rounded-md border font-mono shadow-xl sm:absolute sm:right-0 sm:top-full sm:mt-3 sm:w-80 ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div
            className={`flex items-center justify-between border-b px-4 py-2.5 ${
              isDarkMode ? "border-zinc-800" : "border-zinc-200"
            }`}
          >
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-white" : "text-zinc-900"
              }`}
            >
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className={`text-[11px] hover:underline ${
                  isDarkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                Mark all read
              </button>
            )}
          </div>

          <div
            className={`max-h-80 overflow-y-auto divide-y scrollbar-thin ${
              isDarkMode ? "divide-zinc-800/60" : "divide-zinc-200"
            }`}
          >
            {loading ? (
              <p
                className={`p-4 text-center text-xs ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <p
                className={`p-4 text-center text-xs ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                No notifications
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`flex cursor-pointer flex-col gap-1 p-3 text-xs transition-colors ${
                    item.is_read
                      ? isDarkMode
                        ? "bg-transparent text-zinc-400 hover:bg-zinc-800/30"
                        : "bg-transparent text-zinc-600 hover:bg-zinc-100"
                      : isDarkMode
                        ? "bg-emerald-500/5 text-zinc-200 hover:bg-emerald-500/10"
                        : "bg-emerald-50 text-zinc-900 hover:bg-emerald-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate font-semibold ${
                        isDarkMode ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {item.title}
                    </span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span
                        className={`text-[10px] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        {formatRelativeTime(item.created_at)}
                      </span>
                      {!item.is_read && (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isDarkMode ? "bg-emerald-400" : "bg-emerald-600"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
