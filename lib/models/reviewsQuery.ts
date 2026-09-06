const ReviewsQuery = {
  hasPurchased: (userId: number, productId: number) => {
    return {
      query: `
        SELECT 1 FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.user_id = $1 AND oi.product_id = $2
        LIMIT 1
      `,
      values: [userId, productId],
    };
  },

  getExistingReview: (userId: number, productId: number) => {
    return {
      query: `SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2`,
      values: [userId, productId],
    };
  },

  createReview: (
    productId: number,
    userId: number,
    rating: number,
    comment: string | null,
  ) => {
    return {
      query: `
        INSERT INTO reviews (product_id, user_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      values: [productId, userId, rating, comment],
    };
  },

  getReviewsByProduct: (productId: number) => {
    return {
      query: `
      SELECT r.id, r.rating, r.comment, r.created_at,
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
