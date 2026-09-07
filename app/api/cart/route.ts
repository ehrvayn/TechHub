import {
  handleGetCart,
  handleAddToCart,
  handleDeleteCartItems,
} from "@/lib/controllers/cartController";

export async function GET() {
  return handleGetCart();
}

export async function POST(request: Request) {
  return handleAddToCart(request);
}

export async function DELETE(request: Request) {
  return handleDeleteCartItems(request);
}
