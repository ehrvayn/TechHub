"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import InventoryTable from "@/components/admin/InventoryTable";
import ProductFormModal from "@/components/admin/ProductFormModal";

export default function InventoryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const openAddModal = () => setModalOpen(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <h1 className="font-mono text-lg uppercase tracking-widest text-zinc-300">
          Inventory
        </h1>
        <button
          onClick={openAddModal}
          className="group flex cursor-pointer px-4 py-8 items-stretch gap-2 overflow-hidden rounded-sm border border-emerald-400/40 bg-emerald-400/10 transition-colors hover:border-emerald-400 hover:bg-emerald-400/15"
        >
          <span className="flex items-center text-emerald-400 transition-colors group-hover:border-emerald-400">
            <Plus size={15} />
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
            New Product
          </span>
        </button>
      </div>

      <InventoryTable key={refreshKey} />

      {modalOpen && (
        <ProductFormModal
          product={null}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            setRefreshKey((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
}
