import { handleDeleteReview } from "@/lib/controllers/adminReviewController";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleDeleteReview(Number(id));
}