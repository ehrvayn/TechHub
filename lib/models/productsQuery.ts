const ProductsQuery = {
  retrieveAll: () => {
    return {
      query: `
        SELECT p.id, p.name, p.slug, p.price, p.stock, c.name AS category,
               pi.url AS image_url, pi.alt_text
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
        ORDER BY p.created_at DESC
      `,
      values: [],
    };
  },

  retrieveById: (productId: number) => {
    return {
      query: `
        SELECT p.id, p.name, p.slug, p.price, p.stock, c.name AS category,
               pi.url AS image_url, pi.alt_text
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
        WHERE p.id = $1
      `,
      values: [productId],
    };
  },
};

export default ProductsQuery;
