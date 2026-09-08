"use client";

import { useState } from "react";
import {
  Package,
  Edit2,
  Check,
  Loader2,
  Clock,
  X,
  Truck,
  MapPin,
  Eye,
} from "lucide-react";
import AdminOrderDetails from "./AdminOrderDetails";
import { useDarkMode } from "@/context/DarkModeContext";

type OrderItemRow = {
  item_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number | string;
  quantity: number;
  subtotal: number | string;
  shipping_name: string;
  shipping_address?: string;
  shipping_phone?: string;
  email?: string;
  status: string;
  created_at?: string;
  image_url?: string;
};

interface AdminOrderCardProps {
  orderId: number;
  orderItems: OrderItemRow[];
  isEditing: boolean;
  isUpdating: boolean;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  onStartEdit: (orderId: number, currentStatus: string) => void;
  onCancelEdit: () => void;
  onSaveStatus: (orderId: number) => void;
}

export default function AdminOrderCard({
  orderId,
  orderItems,
  isEditing,
  isUpdating,
  selectedStatus,
  onSelectStatus,
  onStartEdit,
  onCancelEdit,
  onSaveStatus,
}: AdminOrderCardProps) {
  const { isDarkMode } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const firstItem = orderItems[0];

  const orderTotal = orderItems.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0,
  );

  const getStatusBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending")
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    if (s === "processing")
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30";
    if (s === "dispatched")
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
    if (s === "transit")
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
    if (s === "out for delivery")
      return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
    if (s === "delivered" || s === "paid")
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    if (s === "cancelled")
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
    return isDarkMode
      ? "bg-zinc-800 text-zinc-400 border-zinc-700"
      : "bg-zinc-100 text-zinc-600 border-zinc-300";
  };

  const renderStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return <Clock size={12} />;
    if (s === "processing")
      return <Loader2 size={12} className="animate-spin" />;
    if (s === "dispatched" || s === "transit") return <Truck size={12} />;
    if (s === "out for delivery") return <MapPin size={12} />;
    if (s === "delivered" || s === "paid") return <Check size={12} />;
    if (s === "cancelled") return <X size={12} />;
    return null;
  };

  const formatStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <div
        className={`overflow-hidden rounded-md border shadow-sm ${
          isDarkMode
            ? "border-zinc-800 bg-zinc-900/60"
            : "border-zinc-200 bg-white"
        }`}
      >
        <div
          className={`flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
            isDarkMode
              ? "border-zinc-800 bg-zinc-950/60"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-xs font-bold ${
                isDarkMode ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              Order #{orderId}
            </span>
            <span
              className={`text-xs ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              <span
                className={`font-medium ${
                  isDarkMode ? "text-zinc-200" : "text-zinc-800"
                }`}
              >
                {firstItem.shipping_name || "Guest Customer"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`inline-flex items-center border cursor-pointer gap-1 rounded px-2 py-1 text-xs transition-colors ${
                isDarkMode
                  ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
              title="View Details"
            >
              <Eye size={13} />
              <span>Details</span>
            </button>

            {isEditing ? (
              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => onSelectStatus(e.target.value)}
                  className={`rounded border px-2 py-1 text-xs focus:border-emerald-500 focus:outline-none ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-950 text-zinc-100"
                      : "border-zinc-300 bg-white text-zinc-900"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="transit">Transit</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  disabled={isUpdating}
                  onClick={() => onSaveStatus(orderId)}
                  className="rounded p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  title="Save"
                >
                  {isUpdating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                </button>
                <button
                  disabled={isUpdating}
                  onClick={onCancelEdit}
                  className={`rounded p-1 transition-colors ${
                    isDarkMode
                      ? "text-zinc-400 hover:bg-zinc-800"
                      : "text-zinc-500 hover:bg-zinc-100"
                  }`}
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartEdit(orderId, firstItem.status)}
                  className={`inline-flex items-center border cursor-pointer gap-1 rounded px-2 py-1 text-xs transition-colors ${
                    isDarkMode
                      ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                      : "border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                  title="Edit Status"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusBadgeStyle(
                    firstItem.status,
                  )}`}
                >
                  {renderStatusIcon(firstItem.status)}
                  <span>{formatStatusLabel(firstItem.status)}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-136 w-full table-fixed text-left font-mono text-xs">
            <colgroup>
              <col className="w-[50%]" />
              <col className="w-[15%]" />
              <col className="w-[17%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead
              className={`border-b text-[10px] uppercase text-zinc-500 ${
                isDarkMode
                  ? "border-zinc-800/60 bg-zinc-900/30"
                  : "border-zinc-200 bg-zinc-50/50"
              }`}
            >
              <tr>
                <th className="px-4 py-2.5">Product Item</th>
                <th className="px-4 py-2.5 text-center">Qty</th>
                <th className="px-4 py-2.5 text-right">Unit Price</th>
                <th className="px-4 py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode
                  ? "divide-zinc-800 text-zinc-300"
                  : "divide-zinc-200 text-zinc-700"
              }`}
            >
              {orderItems.map((item) => (
                <tr
                  key={`${item.order_id}-${item.item_id}`}
                  className={`transition-colors ${
                    isDarkMode ? "bg-zinc-800/20" : "bg-zinc-50/50"
                  }`}
                >
                  <td
                    className={`px-4 py-3 font-medium truncate ${
                      isDarkMode ? "text-zinc-100" : "text-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className={`h-7 w-7 rounded object-cover border shrink-0 ${
                            isDarkMode ? "border-zinc-800" : "border-zinc-200"
                          }`}
                        />
                      ) : (
                        <Package
                          size={14}
                          className={`shrink-0 ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        />
                      )}
                      <span className="truncate">{item.product_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    {item.quantity}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    ${Number(item.price).toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      isDarkMode ? "text-zinc-100" : "text-zinc-900"
                    }`}
                  >
                    ${Number(item.subtotal).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot
              className={`border-t font-mono text-xs ${
                isDarkMode
                  ? "border-zinc-800 bg-zinc-800/20 text-zinc-400"
                  : "border-zinc-200 bg-zinc-50/50 text-zinc-500"
              }`}
            >
              <tr>
                <td colSpan={4} className="py-5 text-right font-medium">
                  Total:
                  <span className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    ${orderTotal.toFixed(2)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <AdminOrderDetails
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={orderId}
        orderItems={orderItems}
        orderTotal={orderTotal}
      />
    </>
  );
}
