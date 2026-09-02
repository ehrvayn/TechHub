import {
  Package,
  Edit2,
  Check,
  X,
  Loader2,
  Clock,
  XCircle,
} from "lucide-react";

type OrderItemRow = {
  item_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number | string;
  quantity: number;
  subtotal: number | string;
  shipping_name: string;
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
  const firstItem = orderItems[0];

  const orderTotal = orderItems.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0,
  );

  const getStatusBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending")
      return "bg-amber-400/10 text-amber-400 border-amber-400/30";
    if (s === "completed" || s === "paid")
      return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
    if (s === "cancelled")
      return "bg-rose-400/10 text-rose-400 border-rose-400/30";
    return "bg-zinc-800 text-zinc-400 border-zinc-700";
  };

  const renderStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return <Clock size={12} />;
    if (s === "completed" || s === "paid") return <Check size={12} />;
    if (s === "cancelled") return <XCircle size={12} />;
    return null;
  };

  return (
    <div className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/60 shadow-sm">
      <div className="flex flex-col gap-2 border-b border-zinc-800 bg-zinc-950/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-zinc-100">
            Order #{orderId}
          </span>
          <span className="text-xs text-zinc-400">
            <span className="text-zinc-200 font-medium">
              {firstItem.shipping_name || "Guest Customer"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => onSelectStatus(e.target.value)}
                className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 focus:border-emerald-400 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                disabled={isUpdating}
                onClick={() => onSaveStatus(orderId)}
                className="rounded p-1 text-emerald-400 hover:bg-emerald-400/10 transition-colors"
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
                className="rounded p-1 text-zinc-400 hover:bg-zinc-800 transition-colors"
                title="Cancel"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onStartEdit(orderId, firstItem.status)}
                className="inline-flex items-center border border-zinc-700 cursor-pointer gap-1 rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
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
                <span>{firstItem.status}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left font-mono text-xs">
          <colgroup>
            <col className="w-[50%]" />
            <col className="w-[15%]" />
            <col className="w-[17%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead className="border-b border-zinc-800/60 bg-zinc-900/30 text-[10px] uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-2.5">Product Item</th>
              <th className="px-4 py-2.5 text-center">Qty</th>
              <th className="px-4 py-2.5 text-right">Unit Price</th>
              <th className="px-4 py-2.5 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {orderItems.map((item) => (
              <tr
                key={`${item.order_id}-${item.item_id}`}
                className="transition-colors bg-zinc-950/40"
              >
                <td className="px-4 py-3 font-medium text-zinc-100 truncate">
                  <div className="flex items-center gap-2">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="h-7 w-7 rounded object-cover border border-zinc-800 shrink-0"
                      />
                    ) : (
                      <Package size={14} className="text-zinc-500 shrink-0" />
                    )}
                    <span className="truncate">{item.product_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-bold text-emerald-400">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-right text-zinc-400">
                  ${Number(item.price).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-100">
                  ${Number(item.subtotal).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-zinc-800 bg-zinc-950/40 font-mono text-xs">
            <tr>
              <td
                colSpan={4}
                className="py-5 text-right font-medium text-zinc-400"
              >
                Total:
                <span className="px-4 py-3 text-right font-bold text-emerald-400">
                  ${orderTotal.toFixed(2)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
