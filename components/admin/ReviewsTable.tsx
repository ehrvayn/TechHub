"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Star } from "lucide-react";

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  first_name: string;
  last_name: string;
  product_name: string;
};

export default function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchReviews = async () => {
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    await fetchReviews();
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2
          size={20}
          className="animate-spin text-zinc-400 dark:text-zinc-600"
        />
      </div>
    );
  }

  if (reviews.length === 0) {
    return <p className="font-mono text-sm text-zinc-500">No reviews yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="flex items-start justify-between gap-4 rounded-sm border border-zinc-200 bg-white p-3 dark:border-[#2A2F34] dark:bg-[#15181B]"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    fill={s <= r.rating ? "#D1A053" : "none"}
                    stroke="#D1A053"
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-zinc-500">
                {r.first_name} {r.last_name}
              </span>
              <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-700">
                on{" "}
                <span className="text-zinc-700 dark:text-zinc-400">
                  {r.product_name}
                </span>
              </span>
            </div>
            {r.comment && (
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {r.comment}
              </p>
            )}
            <p className="mt-1 font-mono text-[10px] text-zinc-400 dark:text-zinc-700">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => handleDelete(r.id)}
            disabled={deletingId === r.id}
            className="shrink-0 text-zinc-400 transition-colors hover:text-red-600 dark:text-zinc-600 dark:hover:text-red-400 disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
