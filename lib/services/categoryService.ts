import { query } from "@/lib/database/db";
import CategoriesQuery from "@/lib/models/categoriesQuery";

export const listCategories = async () => {
  try {
    const { query: sql, values } = CategoriesQuery.retrieveAll();
    const result = await query(sql, values);
    return { success: true, categories: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};