const ProductsQuery = {
  retrieveAll: () => {
    return {
      query: `
        SELECT p.id, p.name, p.slug, p.specs, p.price, p.stock, c.name AS category,
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

  addProductImage: (productId: number, url: string) => {
    return {
      query: `
      INSERT INTO product_images (product_id, url)
      VALUES ($1, $2)
    `,
      values: [productId, url],
    };
  },

  addProduct: (
    name: string,
    slug: string,
    price: number,
    stock: number,
    categoryId: number,
    description: string,
    specs: any,
  ) => {
    return {
      query: `
        INSERT INTO products (name, slug, price, stock, category_id, description, specs)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      values: [name, slug, price, stock, categoryId, description, specs],
    };
  },

  updateProduct: (
    productId: number,
    name: string,
    slug: string,
    price: number,
    stock: number,
    categoryId: number,
  ) => {
    return {
      query: `
        UPDATE products
        SET name = $2, slug = $3, price = $4, stock = $5, category_id = $6
        WHERE id = $1
        RETURNING *
      `,
      values: [productId, name, slug, price, stock, categoryId],
    };
  },

  deleteProduct: (productId: number) => {
    return {
      query: `
        DELETE FROM products
        WHERE id = $1
        RETURNING *
      `,
      values: [productId],
    };
  },
};

export default ProductsQuery;
