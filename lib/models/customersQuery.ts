const CustomersQuery = {
  getAll: () => {
    return {
      query: `
        SELECT u.id, u.first_name, u.last_name, u.email, u.avatar_url, u.role, u.created_at,
               COUNT(o.id)::int AS order_count,
               COALESCE(SUM(o.total), 0) AS total_spent
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.id
        GROUP BY u.id
        ORDER BY total_spent DESC
      `,
      values: [],
    };
  },

  getById: (userId: number) => {
    return {
      query: `SELECT id, first_name, last_name, email, avatar_url, role, created_at FROM users WHERE id = $1`,
      values: [userId],
    };
  },

  getOrdersByUser: (userId: number) => {
    return {
      query: `SELECT id, status, total, payment_method, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      values: [userId],
    };
  },
};

export default CustomersQuery;