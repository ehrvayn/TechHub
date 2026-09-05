"use client";

import { useState } from "react";
import { Star, Check, Loader2 } from "lucide-react";

type ItemReviewFormProps = {
  productId: number;
};

export function ItemReviewForm({ productId }: ItemReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (rating === 0) {
      setError("Please select a rating.");
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
      setError(result.message || "Something went wrong.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 font-mono text-xs text-emerald-400">
        <Check size={14} />
        <span>Review submitted successfully</span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 font-mono text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
      >
        <Star size={13} className="fill-emerald-400/20" />
        Rate this product
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-400">Your Rating</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-0.5 transition-transform hover:scale-110 active:scale-80 focus:outline-none"
              onClick={() => setRating(star)}
            >
              <Star
                size={16}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-700"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <textarea
        placeholder="Write an optional review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 font-sans text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
      />
      {error && <p className="font-mono text-xs text-rose-400">{error}</p>}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-3 py-1.5 font-mono text-xs text-zinc-400 transition-colors hover:text-zinc-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-md bg-emerald-400 px-3 py-1.5 font-mono text-xs font-semibold text-zinc-950 transition-colors hover:bg-emerald-300 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </div>
  );
}
