"use client";

import { useEffect, useState } from "react";
import StarRating from "@/components/ui/StarRating";
import { Loader2 } from "lucide-react";

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

export default function ReviewSection({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-4 flex justify-center py-6">
        <Loader2 size={16} className="animate-spin text-zinc-700" />
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-sm border border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-4 border-b border-zinc-800 px-3 py-3">
        <span className="font-mono text-2xl font-bold text-zinc-50">
          {average.toFixed(1)}
        </span>
        <div className="flex flex-col gap-0.5">
          <StarRating rating={average} size={13} />
          <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
            {count} {count === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="px-3 py-4 font-mono text-xs text-zinc-600">
          No reviews yet — be the first to leave one after your purchase.
        </p>
      ) : (
        <div className="max-h-56 divide-y divide-zinc-800 overflow-y-auto">
          {reviews.map((r) => {
            const initials =
              `${r.first_name?.[0] ?? ""}${r.last_name?.[0] ?? ""}`.toUpperCase();

            return (
              <div key={r.id} className="flex gap-2.5 px-3 py-2.5">
                {r.avatar_url ? (
                  <img
                    src={r.avatar_url}
                    alt={`${r.first_name} ${r.last_name}`}
                    referrerPolicy="no-referrer"
                    className="h-7 w-7 shrink-0 rounded-full border border-zinc-800 object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 font-mono text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-400/30">
                    {initials || "U"}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <StarRating rating={r.rating} size={12} />
                    <span className="font-mono text-[10px] text-zinc-600">
                      {new Date(r.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-zinc-500">
                    {r.first_name} {r.last_name}
                  </p>
                  {r.comment && (
                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-zinc-400">
                      {r.comment}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
