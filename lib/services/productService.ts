import { query } from "@/lib/database/db";
import ProductsQuery from "@/lib/models/productsQuery";

export const listProducts = async () => {
  try {
    const { query: sql, values } = ProductsQuery.retrieveAll();
    const result = await query(sql, values);

    return { success: true, message: "Products Retrieved!", products: result.rows };
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

    return { success: true, message: "Product Retrieved!", product: result.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};