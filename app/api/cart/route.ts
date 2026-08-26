import { handleAddToCart, handleGetCart } from "@/lib/controllers/cartController";

export async function GET() {
  return handleGetCart();
}

export async function POST(request: Request) {
  return handleAddToCart(request);
}