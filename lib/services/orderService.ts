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

export const listAllOrders = async () => {
  try {
    const { query: sql, values } = OrdersQuery.getAllOrders();
    const result = await query(sql, values);
    return { success: true, orders: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const listAllOrderItems = async () => {
  try {
    const { query: sql, values } = OrdersQuery.getAllOrderItems();
    const result = await query(sql, values);
    return { success: true, items: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const { query: sql, values } = OrdersQuery.updateOrderStatus(
      orderId,
      status,
    );
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Order not found." };
    }

    if (status === "cancelled") {
      for (const item of result.rows) {
        const { query: decSql, values: decValues } =
          OrdersQuery.decrementTotalSold(item.product_id, item.quantity);
        await query(decSql, decValues);
      }
    }

    return { success: true, order: result.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const getAdminStats = async () => {
  try {
    const { query: sql, values } = OrdersQuery.getStats();
    const result = await query(sql, values);
    return { success: true, stats: result.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const getRevenueTrend = async () => {
  try {
    const { query: sql, values } = OrdersQuery.getRevenueByDay();
    const result = await query(sql, values);
    const trend = result.rows.map((row) => ({
      day: new Date(row.day).toISOString().split("T")[0], // "2026-08-25"
      revenue: row.revenue,
    }));
    return { success: true, trend };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
