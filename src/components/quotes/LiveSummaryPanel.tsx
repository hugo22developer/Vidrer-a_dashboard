import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Calculator } from "lucide-react";
import { formatMXN, MIN_BILLABLE_AREA_M2 } from "@/lib/quoteConfig";

interface LiveSummaryPanelProps {
  categoryLabel: string;
  subtypeLabel: string;
  widthCm: number;
  heightCm: number;
  areaM2: number;
  billableAreaM2: number;
  unitPrice: number;
  quantity: number;
}

export function LiveSummaryPanel({
  categoryLabel,
  subtypeLabel,
  widthCm,
  heightCm,
  areaM2,
  billableAreaM2,
  unitPrice,
  quantity,
}: LiveSummaryPanelProps) {
  const usesMinimum = billableAreaM2 > areaM2;

  return (
    <div className="glass-panel sticky top-20 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-accent2">
        <Calculator size={16} />
        <span className="font-mono text-xs uppercase tracking-widest">Precio en tiempo real</span>
      </div>

      <p className="mt-3 font-display text-sm font-semibold text-ink">
        {categoryLabel} {subtypeLabel}
      </p>

      <div className="mt-3 flex items-center gap-2 font-mono text-xs text-ink-muted">
        <Ruler size={13} />
        {widthCm}cm × {heightCm}cm
        <span className="text-ink-faint">·</span>
        {areaM2.toFixed(2)} m²
      </div>

      <AnimatePresence>
        {usesMinimum && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 rounded-lg bg-accent/10 px-2.5 py-1.5 font-mono text-[10px] text-accent"
          >
            Área facturable mínima aplicada: {MIN_BILLABLE_AREA_M2} m²
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-5 border-t border-line pt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-body text-xs text-ink-muted">Precio unitario</span>
          <motion.span
            key={unitPrice}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-xl font-semibold text-ink"
          >
            {formatMXN(unitPrice)}
          </motion.span>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="font-body text-xs text-ink-muted">Cantidad × {quantity}</span>
          <span className="font-mono text-sm text-accent2">{formatMXN(unitPrice * quantity)}</span>
        </div>
      </div>
    </div>
  );
}
