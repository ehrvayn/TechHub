import { NextResponse } from "next/server";
import { submitReview, getProductReviews } from "@/lib/services/reviewService";
import { auth0 } from "@/lib/auth/auth0";
import pool from "@/lib/database/db";

async function getCurrentUserId(): Promise<number | null> {
  const session = await auth0.getSession();
  if (!session) return null;

  const result = await pool.query("SELECT id FROM users WHERE auth0_id = $1", [
    session.user.sub,
  ]);
  return result.rows[0]?.id ?? null;
}

export async function handleGetReviews(productId: number) {
  const result = await getProductReviews(productId);
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result);
}

export async function handleSubmitReview(productId: number, request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  const { rating, comment } = await request.json();
  const result = await submitReview(
    userId,
    productId,
    Number(rating),
    comment || null,
  );

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
