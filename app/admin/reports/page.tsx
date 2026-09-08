import ReportsView from "@/components/admin/ReportsView";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-mono text-lg uppercase tracking-widest text-zinc-300">
        Reports
      </h1>
      <ReportsView />
    </div>
  );
}
