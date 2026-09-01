import { handleGetOrders } from "@/lib/controllers/orderController";

export async function GET() {
  return handleGetOrders();
}