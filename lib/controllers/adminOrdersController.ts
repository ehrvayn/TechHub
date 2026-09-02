import { NextResponse } from "next/server";
import { listAllOrders, updateOrderStatus } from "@/lib/services/orderService";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function handleGetAllOrders() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const result = await listAllOrders();
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result);
}

export async function handleUpdateOrderStatus(
  orderId: number,
  request: Request,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const { status } = await request.json();
  const result = await updateOrderStatus(orderId, status);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }
  return NextResponse.json(result);
}
