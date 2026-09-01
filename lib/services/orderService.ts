import { query } from "@/lib/database/db";
import OrdersQuery from "@/lib/models/ordersQuery";

export const getOrderDetail = async (orderId: number, userId: number) => {
  try {
    const { query: orderSql, values: orderValues } = OrdersQuery.getOrderById(
      orderId,
      userId,
    );
    const orderResult = await query(orderSql, orderValues);

    if (orderResult.rows.length === 0) {
      return { success: false, message: "Order not found." };
    }

    const order = orderResult.rows[0];

    const { query: itemsSql, values: itemsValues } =
      OrdersQuery.getOrderItems(orderId);
    const itemsResult = await query(itemsSql, itemsValues);
    const items = itemsResult.rows;

    return { success: true, order, items };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const listOrders = async (userId: number) => {
  try {
    const { query: sql, values } = OrdersQuery.getOrdersByUser(userId);
    const result = await query(sql, values);

    return { success: true, orders: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};