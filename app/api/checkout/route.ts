import { handleCheckout } from "@/lib/controllers/checkoutController";

export async function POST(request: Request) {
  return handleCheckout(request);
}
