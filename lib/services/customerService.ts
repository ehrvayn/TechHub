import { query } from "@/lib/database/db";
import CustomersQuery from "@/lib/models/customersQuery";

export const listCustomers = async () => {
  try {
    const { query: sql, values } = CustomersQuery.getAll();
    const result = await query(sql, values);
    return { success: true, customers: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const getCustomerDetail = async (userId: number) => {
  try {
    const { query: userSql, values: userValues } = CustomersQuery.getById(userId);
    const userResult = await query(userSql, userValues);

    if (userResult.rows.length === 0) {
      return { success: false, message: "Customer not found." };
    }

    const { query: ordersSql, values: ordersValues } = CustomersQuery.getOrdersByUser(userId);
    const ordersResult = await query(ordersSql, ordersValues);

    return { success: true, customer: userResult.rows[0], orders: ordersResult.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};