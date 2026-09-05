const OrdersQuery = {
  createOrder: (
    userId: number,
    total: number,
    shippingName: string,
    shippingAddress: string,
    shippingCity: string,
    shippingPhone: string,
    paymentMethod: string,
  ) => {
    return {
      query: `
        INSERT INTO orders (user_id, total, shipping_name, shipping_address, shipping_city, shipping_phone, payment_method)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      values: [
        userId,
        total,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingPhone,
        paymentMethod,
      ],
    };
  },

  createOrderItem: (
    orderId: number,
    productId: number,
    productName: string,
    price: number,
    quantity: number,
  ) => {
    return {
      query: `
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      values: [orderId, productId, productName, price, quantity],
    };
  },

  getOrdersByUser: (userId: number) => {
    return {
      query: `
      SELECT 
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        o.status,
        o.created_at,
        pi.url AS image_url
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN LATERAL (
        SELECT url 
        FROM product_images 
        WHERE product_id = oi.product_id 
        ORDER BY sort_order ASC, id ASC 
        LIMIT 1
      ) pi ON true
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `,
      values: [userId],
    };
  },

  getOrderById: (orderId: number, userId: number) => {
    return {
      query: `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      values: [orderId, userId],
    };
  },

  getOrderItems: (orderId: number) => {
    return {
      query: `
      SELECT 
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        (oi.price * oi.quantity) AS subtotal,
        pi.url AS image_url
      FROM order_items oi
      LEFT JOIN LATERAL (
        SELECT url 
        FROM product_images 
        WHERE product_id = oi.product_id 
        ORDER BY sort_order ASC, id ASC 
        LIMIT 1
      ) pi ON true
      WHERE oi.order_id = $1
    `,
      values: [orderId],
    };
  },

  getAllOrders: () => {
    return {
      query: `SELECT o.*, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`,
      values: [],
    };
  },

  getAllOrderItems: () => {
    return {
      query: `
      SELECT 
        oi.id AS item_id,
        oi.order_id,
        oi.product_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        (oi.price * oi.quantity) AS subtotal,
        o.shipping_name,
        o.shipping_address,
        o.shipping_city,
        o.shipping_phone,
        o.payment_method,
        u.email,
        o.status,
        o.created_at,
        pi.url AS image_url
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT url 
        FROM product_images 
        WHERE product_id = oi.product_id 
        ORDER BY sort_order ASC, id ASC 
        LIMIT 1
      ) pi ON true
      ORDER BY o.created_at DESC, oi.id ASC
    `,
      values: [],
    };
  },

  updateOrderStatus: (orderId: number, status: string) => {
    return {
      query: `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      values: [status, orderId],
    };
  },

  getStats: () => {
    return {
      query: `
      SELECT
        COUNT(*)::int AS order_count,
        COALESCE(SUM(total), 0) AS revenue,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_count
      FROM orders
    `,
      values: [],
    };
  },

  getRevenueByDay: () => {
    return {
      query: `
      SELECT
        DATE(created_at) AS day,
        COALESCE(SUM(total), 0) AS revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '14 days'
      GROUP BY DATE(created_at)
      ORDER BY day ASC
    `,
      values: [],
    };
  },
};

export default OrdersQuery;
