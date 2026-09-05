import { query } from "@/lib/database/db";
import ReviewsQuery from "@/lib/models/reviewsQuery";

export const submitReview = async (
  userId: number,
  productId: number,
  rating: number,
  comment: string | null,
) => {
  try {
    if (rating < 1 || rating > 5) {
      return { success: false, message: "Rating must be between 1 and 5." };
    }

    const { query: purchaseSql, values: purchaseValues } =
      ReviewsQuery.hasPurchased(userId, productId);
    const purchaseCheck = await query(purchaseSql, purchaseValues);

    if (purchaseCheck.rows.length === 0) {
      return {
        success: false,
        message: "You can only review products you've purchased.",
      };
    }

    const { query: existingSql, values: existingValues } =
      ReviewsQuery.getExistingReview(userId, productId);
    const existing = await query(existingSql, existingValues);

    if (existing.rows.length > 0) {
      return {
        success: false,
        message: "You've already reviewed this product.",
      };
    }

    const { query: sql, values } = ReviewsQuery.createReview(
      productId,
      userId,
      rating,
      comment,
    );
    const result = await query(sql, values);

    return { success: true, review: result.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const getProductReviews = async (productId: number) => {
  try {
    const { query: reviewsSql, values: reviewsValues } =
      ReviewsQuery.getReviewsByProduct(productId);
    const reviewsResult = await query(reviewsSql, reviewsValues);

    const { query: summarySql, values: summaryValues } =
      ReviewsQuery.getRatingSummary(productId);
    const summaryResult = await query(summarySql, summaryValues);

    return {
      success: true,
      reviews: reviewsResult.rows,
      average: Number(summaryResult.rows[0].average),
      count: summaryResult.rows[0].count,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
