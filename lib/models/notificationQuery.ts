const NotificationQuery = {
  getByUser: (userId: number, limit: number = 20, offset: number = 0) => {
    return {
      query: `
        SELECT id, user_id, type, title, message, link, is_read, created_at
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `,
      values: [userId, limit, offset],
    };
  },

  getUnreadCount: (userId: number) => {
    return {
      query: `
        SELECT COUNT(*)::int AS unread_count
        FROM notifications
        WHERE user_id = $1 AND is_read = FALSE
      `,
      values: [userId],
    };
  },

  create: (
    userId: number,
    type: string,
    title: string,
    message: string,
    link?: string | null,
  ) => {
    return {
      query: `
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      values: [userId, type, title, message, link || null],
    };
  },

  markAsRead: (notificationId: number, userId: number) => {
    return {
      query: `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `,
      values: [notificationId, userId],
    };
  },

  markAllAsRead: (userId: number) => {
    return {
      query: `
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = $1 AND is_read = FALSE
        RETURNING *
      `,
      values: [userId],
    };
  },

  deleteItem: (notificationId: number, userId: number) => {
    return {
      query: `
        DELETE FROM notifications
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `,
      values: [notificationId, userId],
    };
  },

  findById: (notificationId: number) => {
    return {
      query: `SELECT * FROM notifications WHERE id = $1`,
      values: [notificationId],
    };
  },
};

export default NotificationQuery;
