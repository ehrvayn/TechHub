const AdminReviewsQuery = {
  getAll: () => {
    return {
      query: `
        SELECT r.id, r.rating, r.comment, r.created_at,
               u.first_name, u.last_name, u.email,
               p.name AS product_name, p.id AS product_id
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN order_items oi ON r.order_item_id = oi.id
        JOIN products p ON oi.product_id = p.id
        ORDER BY r.created_at DESC
      `,
      values: [],
    };
  },

  deleteById: (reviewId: number) => {
    return {
      query: `DELETE FROM reviews WHERE id = $1 RETURNING *`,
      values: [reviewId],
    };
  },

  getUnreviewedCount: () => {
    return {
      query: `
      SELECT COUNT(*) AS count
      FROM order_items oi
      LEFT JOIN reviews r ON r.order_item_id = oi.id
      WHERE r.id IS NULL
    `,
      values: [],
    };
  },
};

export default AdminReviewsQuery;
