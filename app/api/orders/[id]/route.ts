import { handleGetOrderDetail } from "@/lib/controllers/orderController";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleGetOrderDetail(parseInt(id));
}