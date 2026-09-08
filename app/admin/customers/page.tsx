import CustomersTable from "@/components/admin/CustomersTable";

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-mono text-lg uppercase tracking-widest text-zinc-300">
        Customers
      </h1>
      <CustomersTable />
    </div>
  );
}
