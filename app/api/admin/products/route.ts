import {
  handleGetInventory,
  handleCreateProduct,
} from "@/lib/controllers/adminProductController";

export async function GET() {
  return handleGetInventory();
}

export async function POST(request: Request) {
  return handleCreateProduct(request);
}
