const ReviewsQuery = {
  hasPurchased: (userId: number, orderItemId: number) => {
    return {
      query: `
        SELECT 1 FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.user_id = $1 AND oi.id = $2
        LIMIT 1
      `,
      values: [userId, orderItemId],
    };
  },

  getExistingReview: (orderItemId: number) => {
    return {
      query: `SELECT * FROM reviews WHERE order_item_id = $1`,
      values: [orderItemId],
    };
  },

  createReview: (
    orderItemId: number,
    productId: number,
    userId: number,
    rating: number,
    comment: string | null,
  ) => {
    return {
      query: `
        INSERT INTO reviews (order_item_id, product_id, user_id, rating, comment)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      values: [orderItemId, productId, userId, rating, comment],
    };
  },

  getReviewsByProduct: (productId: number) => {
    return {
      query: `
        SELECT r.id, r.rating, r.comment, r.order_item_id, r.created_at,
               u.first_name, u.last_name, u.email, u.avatar_url
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = $1
        ORDER BY r.created_at DESC
      `,
      values: [productId],
    };
  },

  getRatingSummary: (productId: number) => {
    return {
      query: `
        SELECT COALESCE(AVG(rating), 0) AS average, COUNT(*)::int AS count
        FROM reviews
        WHERE product_id = $1
      `,
      values: [productId],
    };
  },
};

export default ReviewsQuery;
