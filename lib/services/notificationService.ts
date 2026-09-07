import { query } from "@/lib/database/db";
import NotificationQuery from "@/lib/models/notificationQuery";

export const getUserNotifications = async (
  userId: number,
  limit: number = 20,
  offset: number = 0,
) => {
  try {
    const { query: sql, values } = NotificationQuery.getByUser(
      userId,
      limit,
      offset,
    );
    const result = await query(sql, values);
    return { success: true, notifications: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const getUnreadCount = async (userId: number) => {
  try {
    const { query: sql, values } = NotificationQuery.getUnreadCount(userId);
    const result = await query(sql, values);
    const unreadCount = result.rows[0]?.unread_count || 0;
    return { success: true, count: unreadCount };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const createNotification = async (
  userId: number,
  type: string,
  title: string,
  message: string,
  link?: string | null,
) => {
  try {
    const { query: sql, values } = NotificationQuery.create(
      userId,
      type,
      title,
      message,
      link,
    );
    const result = await query(sql, values);
    return { success: true, notification: result.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const markNotificationAsRead = async (
  notificationId: number,
  userId: number,
) => {
  try {
    const { query: sql, values } = NotificationQuery.markAsRead(
      notificationId,
      userId,
    );
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Notification not found." };
    }

    return { success: true, notification: result.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const markAllNotificationsAsRead = async (userId: number) => {
  try {
    const { query: sql, values } = NotificationQuery.markAllAsRead(userId);
    const result = await query(sql, values);
    return { success: true, updatedCount: result.rows.length };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const deleteNotification = async (
  notificationId: number,
  userId: number,
) => {
  try {
    const { query: sql, values } = NotificationQuery.deleteItem(
      notificationId,
      userId,
    );
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Notification not found." };
    }

    return { success: true, notification: result.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
