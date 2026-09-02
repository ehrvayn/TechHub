import { handleGetAllOrderItems } from "@/lib/controllers/orderController";

export async function GET() {
  return handleGetAllOrderItems();
}