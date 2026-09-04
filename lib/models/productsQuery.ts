const ProductsQuery = {
  retrieveAll: () => {
    return {
      query: `
        SELECT p.id, p.name, p.slug, p.specs, p.price, p.stock, p.created_at, c.name AS category,
               COALESCE(
                 JSON_AGG(
                   JSON_BUILD_OBJECT('url', pi.url, 'sort_order', pi.sort_order, 'alt_text', pi.alt_text)
                   ORDER BY pi.sort_order ASC, pi.id ASC
                 ) FILTER (WHERE pi.id IS NOT NULL), '[]'
               ) AS images,
               (
                 SELECT url FROM product_images 
                 WHERE product_id = p.id 
                 ORDER BY sort_order ASC, id ASC 
                 LIMIT 1
               ) AS image_url
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON pi.product_id = p.id
        GROUP BY p.id, c.name
        ORDER BY p.created_at DESC
      `,
      values: [],
    };
  },

  retrieveById: (productId: number) => {
    return {
      query: `
        SELECT p.id, p.name, p.slug, p.price, p.stock, p.description, p.specs, c.name AS category,
               COALESCE(
                 JSON_AGG(
                   JSON_BUILD_OBJECT('url', pi.url, 'sort_order', pi.sort_order, 'alt_text', pi.alt_text)
                   ORDER BY pi.sort_order ASC, pi.id ASC
                 ) FILTER (WHERE pi.id IS NOT NULL), '[]'
               ) AS images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON pi.product_id = p.id
        WHERE p.id = $1
        GROUP BY p.id, c.name
      `,
      values: [productId],
    };
  },

  addProductImage: (productId: number, url: string, sortOrder: number = 0) => {
    return {
      query: `
        INSERT INTO product_images (product_id, url, sort_order)
        VALUES ($1, $2, $3)
      `,
      values: [productId, url, sortOrder],
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
