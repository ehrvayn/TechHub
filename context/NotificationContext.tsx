"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

type NotificationContextType = {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();

    // Open SSE connection using session cookie
    const eventSource = new EventSource("/api/notifications/sse");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "NEW_NOTIFICATION") {
          refreshUnreadCount();
        }
      } catch (err) {
        console.error(err);
      }
    };

    eventSource.onerror = () => {
      // Closes connection if unauthenticated (401/404)
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [refreshUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
}
