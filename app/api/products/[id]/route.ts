import { handleGetProduct } from "@/lib/controllers/productController";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleGetProduct(Number(id));
}
 