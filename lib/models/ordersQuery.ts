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
      query: `SELECT * FROM order_items WHERE order_id = $1`,
      values: [orderId],
    };
  },
};

export default OrdersQuery;
