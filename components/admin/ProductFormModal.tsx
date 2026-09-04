"use client";

import {
  X,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  AdminProductProvider,
  useAdminProduct,
} from "@/context/AdminProductContext";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category_id?: number;
  image_url: string | null;
  description?: string;
  specs?: Record<string, any>;
};

type ProductFormModalProps = {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
};

function ProductFormContent() {
  const {
    isEditing,
    name,
    price,
    stock,
    imageUrl,
    setImageUrl,
    description,
    specRows,
    uploading,
    saving,
    error,
    isDropdownOpen,
    dropdownRef,
    selectedCategoryName,
    filteredCategories,
    setPrice,
    setStock,
    setCategoryId,
    setDescription,
    setIsDropdownOpen,
    handleNameChange,
    handleImageUpload,
    addSpecRow,
    updateSpecRow,
    removeSpecRow,
    handleSubmit,
    onClose,
  } = useAdminProduct();

  const [isDragging, setIsDragging] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageUrl) {
      const urls = imageUrl.includes(",")
        ? imageUrl
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [imageUrl].filter(Boolean);
      setImageUrls(urls);
    } else {
      setImageUrls([]);
    }
  }, [imageUrl]);

  const removeImage = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = imageUrls.filter((_, idx) => idx !== indexToRemove);
    setImageUrls(updated);
    setImageUrl(updated.join(", "));
    if (currentIndex >= updated.length && updated.length > 0) {
      setCurrentIndex(updated.length - 1);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4">
      <div className="w-full max-w-lg rounded border border-[#2A2F34] bg-[#16191D] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between border-b border-[#2A2F34] pb-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#F2F0EB]">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#6B7278] cursor-pointer transition-colors hover:text-[#F2F0EB]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#6B7278]">
                Product Gallery Images
              </label>
              {imageUrls.length > 0 && (
                <span className="font-mono text-[10px] text-emerald-400">
                  {imageUrls.length} image{imageUrls.length > 1 ? "s" : ""}{" "}
                  uploaded
                </span>
              )}
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const fakeEvent = {
                    target: { files: e.dataTransfer.files },
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  handleImageUpload(fakeEvent);
                }
              }}
              className={`relative flex h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-sm border border-dashed transition-colors ${
                isDragging
                  ? "border-emerald-400 bg-emerald-400/5"
                  : "border-[#2A2F34] bg-[#101215] hover:border-zinc-500"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 z-20 cursor-pointer opacity-0"
              />
              {imageUrls.length > 0 ? (
                <div className="relative h-full w-full group">
                  <img
                    src={imageUrls[currentIndex]}
                    alt={`Preview ${currentIndex + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {imageUrls.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors border border-zinc-700 cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors border border-zinc-700 cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 bg-zinc-900/80 border border-zinc-700 px-2 py-0.5 rounded-sm font-mono text-[10px] text-white">
                        {currentIndex + 1} / {imageUrls.length}
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={(e) => removeImage(currentIndex, e)}
                    className="absolute top-2 right-2 z-30 bg-red-900/80 hover:bg-red-700 text-white p-1.5 rounded-sm transition-colors border border-red-700 cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <Upload size={20} className="text-[#6B7278]" />
                  <div className="flex flex-col gap-0.5">
                    <p className="font-mono text-xs uppercase tracking-wide text-[#F2F0EB]">
                      {uploading ? "Uploading..." : "Drag & drop images here"}
                    </p>
                    <p className="font-mono text-[10px] text-[#6B7278]">
                      or click to browse multiple files from device
                    </p>
                  </div>
                </div>
              )}
            </div>

            {imageUrls.length > 0 && (
              <label className="relative flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-sm border border-dashed border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-sm">
                <Upload size={14} />
                <span>{uploading ? "Uploading..." : "Add More Images"}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#6B7278]">
              Product Name
            </label>
            <input
              placeholder="ex. Mechanical Keyboard"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="rounded-sm border border-[#2A2F34] bg-[#101215] px-3 py-2 text-sm text-[#F2F0EB] outline-none transition-colors focus:border-zinc-500"
            />
          </div>

          <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#6B7278]">
              Category
            </label>
            <div className="relative flex items-center">
              <input
                placeholder="Select or type new category..."
                value={selectedCategoryName}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategoryId(val);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full rounded-sm border border-[#2A2F34] bg-[#101215] px-3 py-2 pr-8 text-sm text-[#F2F0EB] outline-none transition-colors focus:border-zinc-500"
              />
              <ChevronDown
                size={14}
                className="absolute right-3 text-[#6B7278] pointer-events-none"
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-sm border border-[#2A2F34] bg-[#16191D] shadow-2xl">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setCategoryId(c.id.toString());
                        setIsDropdownOpen(false);
                      }}
                      className="cursor-pointer px-3 py-2 text-sm text-[#F2F0EB] transition-colors hover:bg-[#2A2F34]"
                    >
                      {c.name}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs font-mono text-[#6B7278]">
                    Press save to create new category: &quot;
                    {selectedCategoryName}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#6B7278]">
                Price ($)
              </label>
              <input
                placeholder="0.00"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-sm border border-[#2A2F34] bg-[#101215] px-3 py-2 font-mono text-sm text-[#F2F0EB] outline-none transition-colors focus:border-zinc-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#6B7278]">
                Stock Qty
              </label>
              <input
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="rounded-sm border border-[#2A2F34] bg-[#101215] px-3 py-2 font-mono text-sm text-[#F2F0EB] outline-none transition-colors focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#6B7278]">
              Description
            </label>
            <textarea
              placeholder="Product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="rounded-sm border border-[#2A2F34] bg-[#101215] px-3 py-2 text-sm text-[#F2F0EB] outline-none transition-colors focus:border-zinc-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#6B7278]">
                Specifications
              </label>
              <button
                type="button"
                onClick={addSpecRow}
                className="flex items-center gap-1 font-mono text-[10px] uppercase text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <Plus size={12} /> Add Spec
              </button>
            </div>

            {specRows.length === 0 ? (
              <p className="font-mono text-xs text-[#6B7278] italic">
                No specifications added yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {specRows.map((row, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      placeholder="ex. Refresh rate"
                      value={row.key}
                      onChange={(e) =>
                        updateSpecRow(index, "key", e.target.value)
                      }
                      className="flex-1 rounded-sm border border-[#2A2F34] bg-[#101215] px-3 py-1.5 font-mono text-xs text-[#F2F0EB] outline-none focus:border-zinc-500"
                    />
                    <input
                      placeholder="ex. 60hz"
                      value={row.value}
                      onChange={(e) =>
                        updateSpecRow(index, "value", e.target.value)
                      }
                      className="flex-1 rounded-sm border border-[#2A2F34] bg-[#101215] px-3 py-1.5 text-xs text-[#F2F0EB] outline-none focus:border-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecRow(index)}
                      className="text-[#6B7278] hover:text-[#C97066] p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="font-mono text-xs text-[#C97066]">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-sm bg-emerald-400 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-emerald-300 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductFormModal(props: ProductFormModalProps) {
  return (
    <AdminProductProvider {...props}>
      <ProductFormContent />
    </AdminProductProvider>
  );
}
