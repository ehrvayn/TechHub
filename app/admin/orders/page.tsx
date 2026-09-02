import AdminOrdersFeed from "@/components/admin/AdminOrdersFeed";

export default function AdminOrdersPage() {
  return (
    <div>
      <h2 className="mb-6 font-mono text-lg uppercase tracking-widest text-zinc-300">
        Orders
      </h2>
      <AdminOrdersFeed />
    </div>
  );
}