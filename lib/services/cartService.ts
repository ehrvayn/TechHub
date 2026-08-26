import { query } from "@/lib/database/db";
import CartQuery from "@/lib/models/cartQuery";

export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number = 1,
) => {
  try {
    const { query: findSql, values: findValues } = CartQuery.findItem(
      userId,
      productId,
    );
    const existing = await query(findSql, findValues);

    if (existing.rows.length > 0) {
      const { query: incSql, values: incValues } = CartQuery.incrementItem(
        existing.rows[0].id,
        quantity,
      );
      const updated = await query(incSql, incValues);
      return { success: true, message: "Cart updated!", item: updated.rows[0] };
    }

    const { query: insSql, values: insValues } = CartQuery.insertItem(
      userId,
      productId,
      quantity,
    );
    const inserted = await query(insSql, insValues);
    return { success: true, message: "Added to cart!", item: inserted.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const getCart = async (userId: number) => {
  try {
    const { query: sql, values } = CartQuery.getCartByUser(userId);
    const result = await query(sql, values);

    const items = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return { success: true, message: "Cart retrieved!", items };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const updateCartItem = async (
  userId: number,
  cartItemId: number,
  quantity: number,
) => {
  try {
    const { query: findSql, values: findValues } =
      CartQuery.findById(cartItemId);
    const existing = await query(findSql, findValues);

    if (existing.rows.length === 0) {
      return { success: false, message: "Cart item not found." };
    }
    if (existing.rows[0].user_id !== userId) {
      return { success: false, message: "Not authorized." };
    }

    const { query: updSql, values: updValues } = CartQuery.updateQuantity(
      cartItemId,
      quantity,
    );
    const updated = await query(updSql, updValues);
    return {
      success: true,
      message: "Quantity updated!",
      item: updated.rows[0],
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const removeCartItem = async (userId: number, cartItemId: number) => {
  try {
    const { query: findSql, values: findValues } =
      CartQuery.findById(cartItemId);
    const existing = await query(findSql, findValues);

    if (existing.rows.length === 0) {
      return { success: false, message: "Cart item not found." };
    }
    if (existing.rows[0].user_id !== userId) {
      return { success: false, message: "Not authorized." };
    }

    const { query: delSql, values: delValues } =
      CartQuery.deleteItem(cartItemId);
    await query(delSql, delValues);
    return { success: true, message: "Item removed from cart!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
