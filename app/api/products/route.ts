import { handleGetProducts } from "@/lib/controllers/productController";

export async function GET() {
  return handleGetProducts();
}