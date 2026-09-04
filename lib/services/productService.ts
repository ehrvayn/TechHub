import { query } from "@/lib/database/db";
import ProductsQuery from "@/lib/models/productsQuery";

export const listProducts = async () => {
  try {
    const { query: sql, values } = ProductsQuery.retrieveAll();
    const result = await query(sql, values);

    return {
      success: true,
      message: "Products Retrieved!",
      products: result.rows,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const retrieveProduct = async (productId: number) => {
  try {
    const { query: sql, values } = ProductsQuery.retrieveById(productId);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Product not found." };
    }

    return {
      success: true,
      message: "Product Retrieved!",
      product: result.rows[0],
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const createProduct = async (
  name: string,
  slug: string,
  price: number,
  stock: number,
  categoryId: number | string,
  imageUrl: string,
  description: string,
  specs: any,
) => {
  try {
    let resolvedCategoryId = Number(categoryId);

    if (isNaN(resolvedCategoryId)) {
      const categoryName = String(categoryId).trim();
      const categorySlug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const existingCategory = await query(
        "SELECT id FROM categories WHERE slug = $1",
        [categorySlug],
      );

      if (existingCategory.rows.length > 0) {
        resolvedCategoryId = existingCategory.rows[0].id;
      } else {
        const newCategory = await query(
          "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id",
          [categoryName, categorySlug],
        );
        resolvedCategoryId = newCategory.rows[0].id;
      }
    }

    const { query: sql, values } = ProductsQuery.addProduct(
      name,
      slug,
      price,
      stock,
      resolvedCategoryId,
      description,
      specs,
    );
    const result = await query(sql, values);
    const product = result.rows[0];

    if (imageUrl) {
      const urls = imageUrl.includes(",")
        ? imageUrl
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [imageUrl];

      for (let i = 0; i < urls.length; i++) {
        const imgQuery = ProductsQuery.addProductImage(product.id, urls[i], i);
        await query(imgQuery.query, imgQuery.values);
      }
    }

    return { success: true, product };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "A product with that slug already exists.",
      };
    }
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const editProduct = async (
  productId: number,
  name: string,
  slug: string,
  price: number,
  stock: number,
  categoryId: number | string,
) => {
  try {
    let resolvedCategoryId = Number(categoryId);

    if (isNaN(resolvedCategoryId)) {
      const categoryName = String(categoryId).trim();
      const categorySlug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const existingCategory = await query(
        "SELECT id FROM categories WHERE slug = $1",
        [categorySlug],
      );

      if (existingCategory.rows.length > 0) {
        resolvedCategoryId = existingCategory.rows[0].id;
      } else {
        const newCategory = await query(
          "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id",
          [categoryName, categorySlug],
        );
        resolvedCategoryId = newCategory.rows[0].id;
      }
    }

    const { query: sql, values } = ProductsQuery.updateProduct(
      productId,
      name,
      slug,
      price,
      stock,
      resolvedCategoryId,
    );
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Product not found." };
    }
    return { success: true, product: result.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const removeProduct = async (productId: number) => {
  try {
    const { query: sql, values } = ProductsQuery.deleteProduct(productId);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Product not found." };
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
