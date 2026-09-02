import { NextResponse } from "next/server";
import {
  getOrderDetail,
  listOrders,
  listAllOrderItems,
  updateOrderStatus,
} from "@/lib/services/orderService";
import { auth0 } from "@/lib/auth/auth0";
import pool from "@/lib/database/db";

async function getCurrentUser(): Promise<{ id: number; role: string } | null> {
  const session = await auth0.getSession();
  if (!session) return null;

  const result = await pool.query(
    "SELECT id, role FROM users WHERE auth0_id = $1",
    [session.user.sub],
  );
  return result.rows[0] ?? null;
}

export async function handleGetOrderDetail(orderId: number) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  try {
    const result = await getOrderDetail(orderId, user.id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error occurred while fetching order detail:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 },
    );
  }
}

export async function handleGetOrders() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  const result = await listOrders(user.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

export async function handleGetAllOrderItems() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden: Admin access required." },
      { status: 403 },
    );
  }

  const result = await listAllOrderItems();

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

export async function handleUpdateOrderStatus(orderId: number, status: string) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden: Admin access required." },
      { status: 403 },
    );
  }

  try {
    const result = await updateOrderStatus(orderId, status);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error occurred while updating order status:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 },
    );
  }
}
