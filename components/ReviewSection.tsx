"use client";

import { useEffect, useState } from "react";
import StarRating from "@/components/ui/StarRating";

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  email: string;
};

export default function ReviewSection({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    const res = await fetch(`/api/products/${productId}/reviews`);
    const data = await res.json();
    if (data.success) {
      setReviews(data.reviews);
      setAverage(data.average);
      setCount(data.count);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    setError("");
    if (rating === 0) {
      setError("Select a star rating first.");
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    const result = await res.json();
    setSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setRating(0);
    setComment("");
    fetchReviews();
  };

  if (loading) return null;

  return (
    <div className="mt-6 border-t border-zinc-800 pt-5">
      <div className="mb-4 flex items-center gap-2">
        <StarRating rating={average} size={16} />
        <span className="font-mono text-sm text-zinc-300">
          {average.toFixed(1)}
        </span>
        <span className="font-mono text-xs text-zinc-500">
          ({count} reviews)
        </span>
      </div>

      <div className="mb-5 flex flex-col gap-2 rounded-sm border border-zinc-800 bg-zinc-950 p-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Leave a review
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)}>
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill={star <= rating ? "#D1A053" : "none"}
                stroke="#D1A053"
                strokeWidth="1"
              >
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
            </button>
          ))}
        </div>
        <textarea
          placeholder="Optional comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/50"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-fit rounded-sm bg-emerald-400 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-zinc-950 hover:bg-emerald-300 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-zinc-500">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <StarRating rating={r.rating} size={13} />
                <span className="font-mono text-xs text-zinc-500">
                  {r.email}
                </span>
              </div>
              {r.comment && (
                <p className="mt-1 text-sm text-zinc-300">{r.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
