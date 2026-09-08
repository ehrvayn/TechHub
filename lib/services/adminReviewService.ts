import { query } from "@/lib/database/db";
import AdminReviewsQuery from "@/lib/models/adminReviewsQuery";

export const listAllReviews = async () => {
  try {
    const { query: sql, values } = AdminReviewsQuery.getAll();
    const result = await query(sql, values);
    return { success: true, reviews: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const deleteReview = async (reviewId: number) => {
  try {
    const { query: sql, values } = AdminReviewsQuery.deleteById(reviewId);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Review not found." };
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const getUnreviewedCount = async () => {
  try {
    const { query: sql, values } = AdminReviewsQuery.getUnreviewedCount();
    const result = await query(sql, values);

    return { success: true, count: Number(result.rows[0].count) };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
