import { handleGetUnreviewedCount } from "@/lib/controllers/adminReviewController";

export async function GET() {
  return handleGetUnreviewedCount();
}
