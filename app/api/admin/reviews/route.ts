import { handleGetAllReviews } from "@/lib/controllers/adminReviewController";

export async function GET() {
  return handleGetAllReviews();
}
