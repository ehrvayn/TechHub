const CartQuery = {
  findItem: (userId: number, productId: number) => {
    return {
      query: `SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2`,
      values: [userId, productId],
    };
  },

  incrementItem: (cartItemId: number, quantity: number) => {
    return {
      query: `UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *`,
      values: [quantity, cartItemId],
    };
  },

  insertItem: (userId: number, productId: number, quantity: number) => {
    return {
      query: `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      values: [userId, productId, quantity],
    };
  },

  getCartByUser: (userId: number) => {
    return {
      query: `
        SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.stock,
               pi.url AS image_url
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
        WHERE ci.user_id = $1
        ORDER BY ci.created_at DESC
      `,
      values: [userId],
    };
  },
  updateQuantity: (cartItemId: number, quantity: number) => {
    return {
      query: `UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *`,
      values: [quantity, cartItemId],
    };
  },

  deleteItem: (cartItemId: number) => {
    return {
      query: `DELETE FROM cart_items WHERE id = $1 RETURNING *`,
      values: [cartItemId],
    };
  },

  findById: (cartItemId: number) => {
    return {
      query: `SELECT * FROM cart_items WHERE id = $1`,
      values: [cartItemId],
    };
  },
};

export default CartQuery;
