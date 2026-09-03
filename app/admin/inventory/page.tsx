import InventoryTable from "@/components/admin/InventoryTable";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-mono text-lg uppercase tracking-widest text-zinc-300">
        Inventory
      </h1>
      <InventoryTable />
    </div>
  );
}
