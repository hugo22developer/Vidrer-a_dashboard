import { motion } from "framer-motion";
import { AppWindow, DoorOpen, PanelsTopLeft, Archive, Copy, Trash2 } from "lucide-react";
import type { QuoteItem } from "@/lib/quoteTypes";
import { formatMXN } from "@/lib/quoteConfig";

const ICONS = { window: AppWindow, door: DoorOpen, panel: PanelsTopLeft, cabinet: Archive };
const ICON_BY_CATEGORY: Record<string, keyof typeof ICONS> = {
  ventana: "window",
  puerta: "door",
  cancel: "panel",
  mueble: "cabinet",
};

interface CartItemRowProps {
  item: QuoteItem;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export function CartItemRow({ item, onRemove, onDuplicate, onQuantityChange }: CartItemRowProps) {
  const Icon = ICONS[ICON_BY_CATEGORY[item.categoryId]];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent2/10 text-accent2">
        <Icon size={20} strokeWidth={1.75} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-semibold text-ink">
          {item.categoryLabel} {item.subtypeLabel}
        </p>
        <p className="mt-0.5 font-mono text-xs text-ink-faint">
          {item.widthCm}×{item.heightCm}cm · {item.areaM2.toFixed(2)}m² · {item.lineaLabel} · {item.acabadoLabel} · {item.vidrioLabel}
        </p>
        {item.herrajeLabels.length > 0 && (
          <p className="mt-1 font-mono text-[10px] text-ink-faint">+ {item.herrajeLabels.join(" · ")}</p>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <label className="font-mono text-[10px] text-ink-faint">Cant.</label>
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => onQuantityChange(item.id, Number(e.target.value) || 1)}
            className="w-14 rounded-lg border border-line bg-surface-2 px-2 py-1.5 text-center font-mono text-sm text-ink outline-none focus:border-accent2"
          />
        </div>

        <div className="text-right">
          <p className="font-mono text-[10px] text-ink-faint">Subtotal</p>
          <p className="font-display text-sm font-semibold text-ink">{formatMXN(item.subtotal)}</p>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => onDuplicate(item.id)}
            aria-label="Duplicar partida"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:border-accent2/50 hover:text-accent2"
          >
            <Copy size={13} />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            aria-label="Eliminar partida"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:border-danger/50 hover:text-danger"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
