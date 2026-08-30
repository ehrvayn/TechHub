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
      query: `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
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
