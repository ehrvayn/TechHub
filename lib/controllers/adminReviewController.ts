import { NextResponse } from "next/server";
import {
  listAllReviews,
  deleteReview,
  getUnreviewedCount,
} from "@/lib/services/adminReviewService";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user)
    return {
      error: NextResponse.json({ message: "Not logged in." }, { status: 401 }),
    };
  if (user.role !== "admin")
    return {
      error: NextResponse.json({ message: "Forbidden." }, { status: 403 }),
    };
  return { error: null };
}

export async function handleGetAllReviews() {
  const { error } = await requireAdmin();
  if (error) return error;

  const result = await listAllReviews();
  if (!result.success) return NextResponse.json(result, { status: 500 });
  return NextResponse.json(result);
}

export async function handleDeleteReview(reviewId: number) {
  const { error } = await requireAdmin();
  if (error) return error;

  const result = await deleteReview(reviewId);
  if (!result.success) return NextResponse.json(result, { status: 404 });
  return NextResponse.json(result);
}

export async function handleGetUnreviewedCount() {
  const result = await getUnreviewedCount();
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result);
}
