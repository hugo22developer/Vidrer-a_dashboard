import { motion } from "framer-motion";
import { AppWindow, DoorOpen, PanelsTopLeft, Archive, ChevronRight } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/quoteConfig";
import type { ProductCategoryId } from "@/lib/quoteTypes";

const ICONS = { window: AppWindow, door: DoorOpen, panel: PanelsTopLeft, cabinet: Archive };

interface Step1ProductProps {
  onSelect: (categoryId: ProductCategoryId, subtypeId: string, subtypeLabel: string) => void;
}

export function Step1Product({ onSelect }: Step1ProductProps) {
  return (
    <div>
      <p className="mb-5 font-body text-sm text-ink-muted">
        Elige el tipo de elemento a cotizar. Podrás configurar sus especificaciones en el siguiente paso.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRODUCT_CATEGORIES.map((cat, i) => {
          const Icon = ICONS[cat.icon];
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass-panel rounded-2xl p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent2/10 text-accent2">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">{cat.label}</h3>
                  <p className="font-body text-xs text-ink-muted">{cat.description}</p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                {cat.subtypes.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onSelect(cat.id, sub.id, sub.label)}
                    className="group flex w-full items-center justify-between rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-left font-body text-sm text-ink transition-colors hover:border-accent2/50 hover:text-accent2"
                  >
                    {cat.label} {sub.label}
                    <ChevronRight size={15} className="text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent2" />
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
