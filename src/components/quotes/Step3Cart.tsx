import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, ShoppingCart } from "lucide-react";
import { CartItemRow } from "./CartItemRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatMXN } from "@/lib/quoteConfig";
import type { QuoteDraft, QuoteItem } from "@/lib/quoteTypes";
import type { calcUnitPrice } from "@/lib/quoteConfig";

interface Step3CartProps {
  draft: QuoteDraft;
  live: ReturnType<typeof calcUnitPrice>;
  hasPendingDraft: boolean;
  cart: QuoteItem[];
  onConfirmDraft: () => void;
  onAddAnother: () => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function Step3Cart({
  draft,
  live,
  hasPendingDraft,
  cart,
  onConfirmDraft,
  onAddAnother,
  onRemove,
  onDuplicate,
  onQuantityChange,
  onBack,
  onContinue,
}: Step3CartProps) {
  const cartTotal = cart.reduce((sum, i) => sum + i.subtotal, 0);

  return (
    <div className="space-y-6">
      {hasPendingDraft && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl border-accent2/30 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-accent2">Partida configurada</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-base font-semibold text-ink">
                {draft.subtypeLabel} · {draft.widthCm}×{draft.heightCm}cm
              </p>
              <p className="mt-1 font-mono text-xs text-ink-faint">
                {live.areaM2.toFixed(2)}m² · Cantidad: {draft.quantity} · {formatMXN(live.unitPrice)} c/u
              </p>
            </div>
            <button
              onClick={onConfirmDraft}
              className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
            >
              <Plus size={16} /> Agregar elemento a la cotización
            </button>
          </div>
        </motion.div>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
            <ShoppingCart size={16} className="text-accent2" />
            Elementos en la cotización ({cart.length})
          </h3>
          {cart.length > 0 && <span className="font-display text-base font-semibold text-ink">{formatMXN(cartTotal)}</span>}
        </div>

        {cart.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Aún no hay elementos"
            description="Confirma la partida configurada arriba, o agrega un nuevo producto para empezar a construir la cotización."
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <CartItemRow key={item.id} item={item} onRemove={onRemove} onDuplicate={onDuplicate} onQuantityChange={onQuantityChange} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 font-body text-sm text-ink-muted transition-colors hover:text-ink">
            <ArrowLeft size={15} /> Volver
          </button>
          <button
            onClick={onAddAnother}
            className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 font-body text-sm text-ink-muted transition-colors hover:border-accent2/50 hover:text-accent2"
          >
            <Plus size={15} /> Agregar otro elemento
          </button>
        </div>
        <button
          onClick={onContinue}
          disabled={cart.length === 0}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
        >
          Continuar con datos del cliente <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
