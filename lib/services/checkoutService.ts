import { query } from "@/lib/database/db";
import OrdersQuery from "@/lib/models/ordersQuery";
import CartQuery from "@/lib/models/cartQuery";

type CheckoutInput = {
  userId: number;
  cartItemIds: number[];
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  paymentMethod: string;
};

export const checkout = async (input: CheckoutInput) => {
  try {
    const { query: cartSql, values: cartValues } = CartQuery.getCartByUser(
      input.userId,
    );
    const cartResult = await query(cartSql, cartValues);

    const selectedItems = cartResult.rows.filter((row) =>
      input.cartItemIds.includes(row.id),
    );

    if (selectedItems.length === 0) {
      return { success: false, message: "No valid items selected." };
    }

    const total = selectedItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    const { query: orderSql, values: orderValues } = OrdersQuery.createOrder(
      input.userId,
      total,
      input.shippingName,
      input.shippingAddress,
      input.shippingCity,
      input.shippingPhone,
      input.paymentMethod,
    );
    const orderResult = await query(orderSql, orderValues);
    const order = orderResult.rows[0];

    for (const item of selectedItems) {
      const { query: itemSql, values: itemValues } =
        OrdersQuery.createOrderItem(
          order.id,
          item.product_id,
          item.name,
          item.price,
          item.quantity,
        );
      await query(itemSql, itemValues);
    }

    for (const item of selectedItems) {
      const { query: delSql, values: delValues } = CartQuery.deleteItem(
        item.id,
      );
      await query(delSql, delValues);
    }

    return { success: true, message: "Order placed!", order };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};


