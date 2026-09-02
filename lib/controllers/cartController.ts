import { addToCart, getCart, updateCartItem, removeCartItem } from "@/lib/services/cartService";
import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import pool from "@/lib/database/db";

async function getCurrentUserId(): Promise<number | null> {
  const session = await auth0.getSession();
  if (!session) return null;

  const result = await pool.query("SELECT id FROM users WHERE auth0_id = $1", [
    session.user.sub,
  ]);
  return result.rows[0]?.id ?? null;
}

export async function handleAddToCart(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  const { productId, quantity } = await request.json();
  const result = await addToCart(userId, productId, quantity ?? 1);

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 500 });
  }
  return NextResponse.json(result);
}

export async function handleGetCart() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  const result = await getCart(userId);
  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 500 });
  }
  return NextResponse.json(result.items);
}

export async function handleUpdateCartItem(
  cartItemId: number,
  request: Request,
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  const { quantity } = await request.json();
  const result = await updateCartItem(userId, cartItemId, quantity);

  if (!result.success) {
    const status =
      result.message === "Not authorized."
        ? 403
        : result.message === "Cart item not found."
          ? 404
          : 500;
    return NextResponse.json({ message: result.message }, { status });
  }
  return NextResponse.json(result);
}

export async function handleDeleteCartItem(cartItemId: number) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  const result = await removeCartItem(userId, cartItemId);

  if (!result.success) {
    const status =
      result.message === "Not authorized."
        ? 403
        : result.message === "Cart item not found."
          ? 404
          : 500;
    return NextResponse.json({ message: result.message }, { status });
  }
  return NextResponse.json(result);
}
