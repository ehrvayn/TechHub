"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

type Category = { id: number; name: string; slug: string };

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

type SpecRow = { key: string; value: string };

type AdminProductContextType = {
  isEditing: boolean;
  categories: Category[];
  name: string;
  slug: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
  description: string;
  specRows: SpecRow[];
  uploading: boolean;
  saving: boolean;
  error: string;
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  selectedCategoryName: string;
  filteredCategories: Category[];
  setName: (val: string) => void;
  setSlug: (val: string) => void;
  setPrice: (val: string) => void;
  setStock: (val: string) => void;
  setCategoryId: (val: string) => void;
  setDescription: (val: string) => void;
  setIsDropdownOpen: (val: boolean) => void;
  handleNameChange: (value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  addSpecRow: () => void;
  updateSpecRow: (index: number, field: "key" | "value", val: string) => void;
  removeSpecRow: (index: number) => void;
  handleSubmit: () => Promise<void>;
  onClose: () => void;
};

const AdminProductContext = createContext<AdminProductContextType | null>(null);

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminProductProvider({
  product,
  onClose,
  onSaved,
  children,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
  children: React.ReactNode;
}) {
  const isEditing = !!product;

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.category_id?.toString() ?? "",
  );
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [description, setDescription] = useState(product?.description ?? "");

  const [specRows, setSpecRows] = useState<SpecRow[]>(() => {
    if (product?.specs && Object.keys(product.specs).length > 0) {
      return Object.entries(product.specs).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    }
    return [{ key: "", value: "" }];
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditing) {
      setSlug(slugify(value));
    }
  };

  const addSpecRow = () => {
    setSpecRows([...specRows, { key: "", value: "" }]);
  };

  const updateSpecRow = (
    index: number,
    field: "key" | "value",
    val: string,
  ) => {
    const updated = [...specRows];
    updated[index][field] = val;
    setSpecRows(updated);
  };

  const removeSpecRow = (index: number) => {
    setSpecRows(specRows.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        setError(data.message || "Upload failed.");
      }
    } catch {
      setError("Network error during image upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    const finalSlug = slug || slugify(name);

    if (!name || !finalSlug || !price || !stock || !categoryId) {
      setError("All fields are required.");
      return;
    }

    const parsedSpecs: Record<string, string> = {};
    for (const row of specRows) {
      const trimmedKey = row.key.trim();
      if (trimmedKey) {
        parsedSpecs[trimmedKey] = row.value.trim();
      }
    }

    setSaving(true);
    const url = isEditing
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        price,
        stock,
        categoryId,
        image_url: imageUrl,
        description,
        specs: parsedSpecs,
      }),
    });
    const result = await res.json();
    setSaving(false);

    if (!result.success) {
      setError(result.message || "Something went wrong.");
      return;
    }

    onSaved();
  };

  const selectedCategoryName =
    categories.find((c) => c.id.toString() === categoryId)?.name ?? categoryId;

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(selectedCategoryName.toLowerCase()),
  );

  return (
    <AdminProductContext.Provider
      value={{
        isEditing,
        categories,
        name,
        slug,
        price,
        stock,
        categoryId,
        imageUrl,
        description,
        specRows,
        uploading,
        saving,
        error,
        isDropdownOpen,
        dropdownRef,
        selectedCategoryName,
        filteredCategories,
        setName,
        setSlug,
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
      }}
    >
      {children}
    </AdminProductContext.Provider>
  );
}

export function useAdminProduct() {
  const context = useContext(AdminProductContext);
  if (!context) {
    throw new Error("useAdminProduct must be used within AdminProductProvider");
  }
  return context;
}
