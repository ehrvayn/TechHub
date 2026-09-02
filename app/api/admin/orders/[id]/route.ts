import { NextRequest } from "next/server";
import { handleUpdateOrderStatus } from "@/lib/controllers/orderController";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  return handleUpdateOrderStatus(Number(id), body.status);
}
