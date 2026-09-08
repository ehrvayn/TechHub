const ReportsQuery = {
  getBestSellers: () => {
    return {
      query: `
        SELECT oi.product_name, SUM(oi.quantity)::int AS units_sold, SUM(oi.price * oi.quantity) AS revenue
        FROM order_items oi
        GROUP BY oi.product_name
        ORDER BY units_sold DESC
        LIMIT 10
      `,
      values: [],
    };
  },

  getRevenueByCategory: () => {
    return {
      query: `
        SELECT c.name AS category, COALESCE(SUM(oi.price * oi.quantity), 0) AS revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        GROUP BY c.name
        ORDER BY revenue DESC
      `,
      values: [],
    };
  },

  getMonthlyRevenue: () => {
    return {
      query: `
        SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, COALESCE(SUM(total), 0) AS revenue
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month ASC
      `,
      values: [],
    };
  },
};

export default ReportsQuery;
