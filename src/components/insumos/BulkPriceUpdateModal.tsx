import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { inputClass } from "@/components/ui/FormField";
import { INSUMO_CATEGORIAS } from "@/lib/insumoTypes";
import type { Insumo, InsumoCategoria } from "@/lib/insumoTypes";
import { formatMXN } from "@/lib/quoteConfig";

interface BulkPriceUpdateModalProps {
  open: boolean;
  onClose: () => void;
  insumos: Insumo[];
  onApply: (scope: InsumoCategoria | "all", percent: number) => void;
}

export function BulkPriceUpdateModal({ open, onClose, insumos, onApply }: BulkPriceUpdateModalProps) {
  const [scope, setScope] = useState<InsumoCategoria | "all">("all");
  const [percent, setPercent] = useState(5);

  const affected = useMemo(() => (scope === "all" ? insumos : insumos.filter((i) => i.categoria === scope)), [insumos, scope]);

  const impact = useMemo(() => {
    const before = affected.reduce((sum, i) => sum + i.costoUnitario, 0);
    const after = affected.reduce((sum, i) => sum + i.costoUnitario * (1 + percent / 100), 0);
    return { before, after, delta: after - before };
  }, [affected, percent]);

  function handleApply() {
    if (affected.length === 0 || percent === 0) return;
    onApply(scope, percent);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Actualización masiva de precios" description="Aplica un ajuste inflacionario o de proveedor a toda una categoría, o a todo el catálogo de insumos." size="lg">
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block font-mono text-xs text-ink-muted">Alcance del ajuste</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setScope("all")}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                scope === "all" ? "border-accent2/60 bg-accent2/10 text-accent2" : "border-line text-ink-muted"
              }`}
            >
              Todas las categorías
            </button>
            {INSUMO_CATEGORIAS.map((c) => (
              <button
                key={c}
                onClick={() => setScope(c)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                  scope === c ? "border-accent2/60 bg-accent2/10 text-accent2" : "border-line text-ink-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="bulk-percent" className="mb-1.5 block font-mono text-xs text-ink-muted">
            Porcentaje de ajuste
          </label>
          <div className="flex items-center gap-3">
            {percent >= 0 ? <TrendingUp size={18} className="text-success" /> : <TrendingDown size={18} className="text-danger" />}
            <input
              id="bulk-percent"
              type="number"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className={`${inputClass} max-w-[140px]`}
            />
            <span className="font-mono text-sm text-ink-muted">%</span>
          </div>
          <p className="mt-1 font-body text-xs text-ink-faint">Usa un valor negativo para aplicar una reducción de costo.</p>
        </div>

        {/* Impacto simulado */}
        <div className="rounded-2xl border border-line bg-surface-2 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">Impacto simulado</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-mono text-[10px] text-ink-faint">Insumos afectados</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">{affected.length}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-ink-faint">Costo actual acumulado</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">{formatMXN(impact.before)}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-ink-faint">Nuevo costo acumulado</p>
              <p className={`mt-1 font-display text-lg font-semibold ${impact.delta >= 0 ? "text-accent" : "text-success"}`}>
                {formatMXN(impact.after)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-xs text-ink-muted">
            Variación: <span className={impact.delta >= 0 ? "text-accent" : "text-success"}>{impact.delta >= 0 ? "+" : ""}{formatMXN(impact.delta)}</span>
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ink-muted transition-colors hover:text-ink">
            Cancelar
          </button>
          <button
            onClick={handleApply}
            disabled={affected.length === 0 || percent === 0}
            className="rounded-full bg-accent px-5 py-2 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
          >
            Aplicar ajuste a {affected.length} insumo{affected.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </Modal>
  );
}
