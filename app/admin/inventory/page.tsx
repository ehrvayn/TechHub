"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import InventoryTable from "@/components/admin/InventoryTable";
import ProductFormModal from "@/components/admin/ProductFormModal";
import { useDarkMode } from "@/context/DarkModeContext";

export default function InventoryPage() {
  const { isDarkMode } = useDarkMode();
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const openAddModal = () => setModalOpen(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1
          className={`font-mono text-lg uppercase tracking-widest ${
            isDarkMode ? "text-[#F2F0EB]" : "text-zinc-900"
          }`}
        >
          Inventory
        </h1>
        <button
          onClick={openAddModal}
          className="group flex cursor-pointer items-center gap-2 rounded-sm border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 transition-colors hover:border-emerald-400 hover:bg-emerald-400/15 sm:px-4 sm:py-3"
        >
          <span className="flex items-center text-emerald-400 transition-colors">
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
