import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField, inputClass } from "@/components/ui/FormField";
import { SpecListEditor } from "@/components/ui/SpecListEditor";
import type { Category } from "@/lib/types";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  initial?: Category | null;
  existingSlugs: string[];
}

const EMPTY: Category = {
  slug: "",
  label: "",
  shortLabel: "",
  eyebrow: "",
  heroDescription: "",
  heroSpecs: [],
  accent: "from-accent2/25 via-surface to-canvas",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryFormModal({ open, onClose, onSave, initial, existingSlugs }: CategoryFormModalProps) {
  const [form, setForm] = useState<Category>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(initial ?? EMPTY);
      setErrors({});
    }
  }, [open, initial]);

  function handleLabelChange(label: string) {
    setForm((f) => ({
      ...f,
      label,
      shortLabel: f.shortLabel === slugToShort(f.label) ? label : f.shortLabel,
      slug: initial ? f.slug : slugify(label),
    }));
  }

  function slugToShort(label: string) {
    return label; // heurística simple: por defecto el shortLabel espeja al label
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.label.trim()) next.label = "El nombre es obligatorio.";
    if (!form.slug.trim()) next.slug = "El slug es obligatorio.";
    else if (!initial && existingSlugs.includes(form.slug)) next.slug = "Ya existe una categoría con este slug.";
    if (!form.heroDescription.trim()) next.heroDescription = "Agrega una descripción breve.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, shortLabel: form.shortLabel || form.label });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={initial ? "Editar categoría" : "Nueva categoría"}
      description="Estas categorías alimentan directamente el catálogo de la landing."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nombre completo" htmlFor="c-label" error={errors.label}>
            <input
              id="c-label"
              value={form.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className={inputClass}
              placeholder="Ej. Canceles de Baño"
            />
          </FormField>

          <FormField label="Slug (URL)" htmlFor="c-slug" error={errors.slug}>
            <input
              id="c-slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              className={`${inputClass} font-mono`}
              placeholder="canceles-de-bano"
              disabled={!!initial}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nombre corto (footer)" htmlFor="c-short">
            <input
              id="c-short"
              value={form.shortLabel}
              onChange={(e) => setForm({ ...form, shortLabel: e.target.value })}
              className={inputClass}
              placeholder="Canceles de baño"
            />
          </FormField>
          <FormField label="Eyebrow (etiqueta superior)" htmlFor="c-eyebrow">
            <input
              id="c-eyebrow"
              value={form.eyebrow}
              onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
              className={inputClass}
              placeholder="Línea Canceles"
            />
          </FormField>
        </div>

        <FormField label="Descripción (hero)" htmlFor="c-desc" error={errors.heroDescription}>
          <textarea
            id="c-desc"
            rows={3}
            value={form.heroDescription}
            onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Descripción breve que aparece en el hero de la categoría..."
          />
        </FormField>

        <FormField label="Specs destacadas (hero)" htmlFor="c-specs">
          <SpecListEditor specs={form.heroSpecs} onChange={(heroSpecs) => setForm({ ...form, heroSpecs })} />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ink-muted transition-colors hover:text-ink">
            Cancelar
          </button>
          <button type="submit" className="rounded-full bg-accent px-5 py-2 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]">
            {initial ? "Guardar cambios" : "Crear categoría"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
