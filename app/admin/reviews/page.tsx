import ReviewsTable from "@/components/admin/ReviewsTable";

export default function AdminReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-mono text-lg uppercase tracking-widest text-zinc-300">
        Reviews
      </h1>
      <ReviewsTable />
    </div>
  );
}
