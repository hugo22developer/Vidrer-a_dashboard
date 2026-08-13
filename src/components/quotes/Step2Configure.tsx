import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { inputClass } from "@/components/ui/FormField";
import { LiveSummaryPanel } from "./LiveSummaryPanel";
import { ACABADOS_ALUMINIO, HERRAJES, LINEAS_ALUMINIO, TIPOS_VIDRIO, formatMXN } from "@/lib/quoteConfig";
import type { ProductCategory, QuoteDraft } from "@/lib/quoteTypes";
import type { calcUnitPrice } from "@/lib/quoteConfig";

interface Step2ConfigureProps {
  category: ProductCategory;
  draft: QuoteDraft;
  live: ReturnType<typeof calcUnitPrice>;
  onChange: (patch: Partial<QuoteDraft>) => void;
  onToggleHerraje: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function Step2Configure({ category, draft, live, onChange, onToggleHerraje, onBack, onContinue }: Step2ConfigureProps) {
  const [unit, setUnit] = useState<"cm" | "m">("cm");
  const { limits } = category;

  const widthValid = draft.widthCm >= limits.minW && draft.widthCm <= limits.maxW;
  const heightValid = draft.heightCm >= limits.minH && draft.heightCm <= limits.maxH;
  const formValid = widthValid && heightValid && draft.quantity >= 1;

  function displayValue(cm: number) {
    return unit === "cm" ? cm : Number((cm / 100).toFixed(2));
  }
  function handleDimChange(field: "widthCm" | "heightCm", raw: string) {
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    onChange({ [field]: unit === "cm" ? parsed : Math.round(parsed * 100) });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        {/* Dimensiones */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink">Dimensiones</h3>
            <div className="flex rounded-full border border-line p-0.5 font-mono text-[11px]">
              {(["cm", "m"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`rounded-full px-2.5 py-1 transition-colors ${unit === u ? "bg-accent2/15 text-accent2" : "text-ink-faint"}`}
                >
                  {u === "cm" ? "Centímetros" : "Metros"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block font-mono text-xs text-ink-muted">Ancho</label>
              <input
                type="number"
                value={displayValue(draft.widthCm)}
                onChange={(e) => handleDimChange("widthCm", e.target.value)}
                step={unit === "cm" ? 1 : 0.01}
                className={`${inputClass} ${!widthValid ? "border-danger" : ""}`}
              />
              <p className="mt-1 font-mono text-[10px] text-ink-faint">
                Rango: {limits.minW}–{limits.maxW}cm
              </p>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs text-ink-muted">Alto</label>
              <input
                type="number"
                value={displayValue(draft.heightCm)}
                onChange={(e) => handleDimChange("heightCm", e.target.value)}
                step={unit === "cm" ? 1 : 0.01}
                className={`${inputClass} ${!heightValid ? "border-danger" : ""}`}
              />
              <p className="mt-1 font-mono text-[10px] text-ink-faint">
                Rango: {limits.minH}–{limits.maxH}cm
              </p>
            </div>
          </div>
          {(!widthValid || !heightValid) && (
            <p className="mt-3 flex items-center gap-1.5 font-body text-xs text-danger">
              <AlertCircle size={13} /> Ajusta las medidas dentro del rango permitido para este producto.
            </p>
          )}
        </motion.section>

        {/* Línea de aluminio */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink">Sistema de Aluminio</h3>
          <div className="space-y-2">
            {LINEAS_ALUMINIO.map((linea) => (
              <button
                key={linea.id}
                onClick={() => onChange({ lineaId: linea.id })}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  draft.lineaId === linea.id ? "border-accent2/60 bg-accent2/5" : "border-line hover:border-line"
                }`}
              >
                <div>
                  <p className="font-body text-sm font-medium text-ink">{linea.label}</p>
                  <p className="mt-0.5 font-body text-xs text-ink-muted">{linea.description}</p>
                </div>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line">
                  {draft.lineaId === linea.id && <Check size={12} className="text-accent2" />}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Acabado */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink">Acabado del Aluminio</h3>
          <div className="flex flex-wrap gap-4">
            {ACABADOS_ALUMINIO.map((acabado) => (
              <button key={acabado.id} onClick={() => onChange({ acabadoId: acabado.id })} className="flex flex-col items-center gap-1.5">
                <span
                  style={{ background: acabado.swatch }}
                  className={`h-9 w-9 rounded-full border-2 transition-shadow ${
                    draft.acabadoId === acabado.id ? "border-accent2 shadow-[0_0_0_3px_var(--color-accent2)_inset]" : "border-line"
                  }`}
                />
                <span className="font-mono text-[10px] text-ink-muted">{acabado.label}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Vidrio */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink">Tipo de Vidrio</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TIPOS_VIDRIO.map((vidrio) => (
              <button
                key={vidrio.id}
                onClick={() => onChange({ vidrioId: vidrio.id })}
                className={`rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                  draft.vidrioId === vidrio.id ? "border-accent2/60 bg-accent2/5" : "border-line"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-body text-sm font-medium text-ink">{vidrio.label}</p>
                  {draft.vidrioId === vidrio.id && <Check size={13} className="text-accent2" />}
                </div>
                <p className="mt-0.5 font-mono text-[10px] text-ink-faint">{vidrio.spec}</p>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Herrajes */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink">Herrajes y Accesorios</h3>
          <div className="space-y-2">
            {HERRAJES.map((h) => (
              <label
                key={h.id}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-line px-3.5 py-2.5 transition-colors hover:border-accent2/40"
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={draft.herrajeIds.includes(h.id)}
                    onChange={() => onToggleHerraje(h.id)}
                    className="h-4 w-4 accent-accent2"
                  />
                  <span className="font-body text-sm text-ink">{h.label}</span>
                </span>
                <span className="font-mono text-xs text-ink-muted">+{formatMXN(h.price)}</span>
              </label>
            ))}
          </div>
        </motion.section>

        {/* Cantidad */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-panel flex items-center justify-between rounded-2xl p-5">
          <h3 className="font-display text-sm font-semibold text-ink">Cantidad de piezas</h3>
          <input
            type="number"
            min={1}
            value={draft.quantity}
            onChange={(e) => onChange({ quantity: Math.max(1, Number(e.target.value) || 1) })}
            className={`${inputClass} w-24 text-center`}
          />
        </motion.section>

        <div className="flex justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 font-body text-sm text-ink-muted transition-colors hover:text-ink">
            <ArrowLeft size={15} /> Cambiar producto
          </button>
          <button
            onClick={onContinue}
            disabled={!formValid}
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
          >
            Continuar <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <div>
        <LiveSummaryPanel
          categoryLabel={category.label}
          subtypeLabel={draft.subtypeLabel ?? ""}
          widthCm={draft.widthCm}
          heightCm={draft.heightCm}
          areaM2={live.areaM2}
          billableAreaM2={live.billableAreaM2}
          unitPrice={live.unitPrice}
          quantity={draft.quantity}
        />
      </div>
    </div>
  );
}
