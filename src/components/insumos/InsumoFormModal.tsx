import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField, inputClass } from "@/components/ui/FormField";
import { INSUMO_CATEGORIAS, UNIDADES_MEDIDA } from "@/lib/insumoTypes";
import type { Insumo, InsumoCategoria, UnidadMedida, InsumoEstado } from "@/lib/insumoTypes";

interface InsumoFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (insumo: Insumo) => void;
  initial?: Insumo | null;
}

const PREFIX: Record<InsumoCategoria, string> = {
  "Perfiles de Aluminio": "ALU-PRF",
  "Cristales / Vidrios": "VID-CRI",
  "Herrajes y Accesorios": "HER-ACC",
  "Consumibles / Selladores": "CON-SEL",
};

const EMPTY = {
  sku: "",
  nombre: "",
  categoria: INSUMO_CATEGORIAS[0],
  unidad: "m" as UnidadMedida,
  costoUnitario: 0,
  factorDesperdicio: 5,
  notas: "",
  estado: "active" as InsumoEstado,
};

export function InsumoFormModal({ open, onClose, onSave, initial }: InsumoFormModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              sku: initial.sku,
              nombre: initial.nombre,
              categoria: initial.categoria,
              unidad: initial.unidad,
              costoUnitario: initial.costoUnitario,
              factorDesperdicio: initial.factorDesperdicio,
              notas: initial.notas,
              estado: initial.estado,
            }
          : EMPTY
      );
      setErrors({});
    }
  }, [open, initial]);

  function validate() {
    const next: Record<string, string> = {};
    if (!form.nombre.trim()) next.nombre = "El nombre es obligatorio.";
    if (form.costoUnitario <= 0) next.costoUnitario = "El costo debe ser mayor a 0.";
    if (form.factorDesperdicio < 0) next.factorDesperdicio = "No puede ser negativo.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: initial?.id ?? `i${Date.now()}`,
      pendingReview: initial?.pendingReview ?? false,
      ultimaModificacion: new Date().toISOString().slice(0, 10),
      ...form,
      sku: form.sku || `${PREFIX[form.categoria]}-${String(Date.now()).slice(-3)}`,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} size="lg" title={initial ? "Editar insumo" : "Nuevo insumo"} description="Materia prima usada en el cálculo de cotizaciones.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
          <FormField label="Nombre del insumo" htmlFor="i-nombre" error={errors.nombre}>
            <input id="i-nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputClass} placeholder="Ej. Riel superior Serie 3" />
          </FormField>
          <FormField label="SKU (opcional)" htmlFor="i-sku">
            <input id="i-sku" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} className={`${inputClass} font-mono text-xs`} placeholder="Autogenerado" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Categoría" htmlFor="i-categoria">
            <select
              id="i-categoria"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value as InsumoCategoria })}
              className={`${inputClass} appearance-none`}
            >
              {INSUMO_CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Unidad de medida" htmlFor="i-unidad">
            <select id="i-unidad" value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value as UnidadMedida })} className={`${inputClass} appearance-none`}>
              {UNIDADES_MEDIDA.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Costo unitario ($)" htmlFor="i-costo" error={errors.costoUnitario}>
            <input
              id="i-costo"
              type="number"
              min={0}
              step="0.01"
              value={form.costoUnitario}
              onChange={(e) => setForm({ ...form, costoUnitario: Math.max(0, Number(e.target.value)) })}
              className={inputClass}
            />
          </FormField>
          <FormField label="Desperdicio sugerido (%)" htmlFor="i-desperdicio" error={errors.factorDesperdicio}>
            <input
              id="i-desperdicio"
              type="number"
              min={0}
              max={100}
              value={form.factorDesperdicio}
              onChange={(e) => setForm({ ...form, factorDesperdicio: Math.max(0, Number(e.target.value)) })}
              className={inputClass}
            />
          </FormField>
          <FormField label="Estado" htmlFor="i-estado">
            <select id="i-estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as InsumoEstado })} className={`${inputClass} appearance-none`}>
              <option value="active">Activo</option>
              <option value="discontinued">Descontinuado</option>
            </select>
          </FormField>
        </div>

        <FormField label="Notas internas de proveedor" htmlFor="i-notas">
          <textarea id="i-notas" rows={2} value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} className={`${inputClass} resize-none`} placeholder="Proveedor, tiempos de entrega, observaciones..." />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ink-muted transition-colors hover:text-ink">
            Cancelar
          </button>
          <button type="submit" className="rounded-full bg-accent px-5 py-2 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]">
            {initial ? "Guardar cambios" : "Registrar insumo"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
