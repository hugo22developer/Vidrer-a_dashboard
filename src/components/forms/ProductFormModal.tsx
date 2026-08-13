import { useEffect, useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField, inputClass } from "@/components/ui/FormField";
import { SpecListEditor } from "@/components/ui/SpecListEditor";
import { ImageOff } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Category, Product, ProductStatus } from "@/lib/types";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initial?: Product | null;
  categories: Category[];
  defaultCategorySlug?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductFormModal({ open, onClose, onSave, initial, categories, defaultCategorySlug }: ProductFormModalProps) {
  const empty: Omit<Product, "id" | "consultations"> = {
    slug: "",
    categorySlug: defaultCategorySlug ?? categories[0]?.slug ?? "",
    title: "",
    description: "",
    image: "",
    specs: [],
    status: "draft",
  };

  const [form, setForm] = useState(empty);
  const [imgFailed, setImgFailed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              slug: initial.slug,
              categorySlug: initial.categorySlug,
              title: initial.title,
              description: initial.description,
              image: initial.image,
              specs: initial.specs,
              status: initial.status,
            }
          : { ...empty, categorySlug: defaultCategorySlug ?? categories[0]?.slug ?? "" }
      );
      setImgFailed(false);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial, defaultCategorySlug]);

  function validate() {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "El título es obligatorio.";
    if (!form.description.trim()) next.description = "Agrega una descripción.";
    if (!form.categorySlug) next.categorySlug = "Selecciona una categoría.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: initial?.id ?? `p${Date.now()}`,
      consultations: initial?.consultations ?? 0,
      ...form,
      slug: form.slug || slugify(form.title),
      image: form.image || `/products/${form.categorySlug}/${form.slug || slugify(form.title)}.jpg`,
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={initial ? "Editar producto" : "Nuevo producto"}
      description="Estos datos alimentan directamente la tarjeta de producto en la landing."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_1.3fr]">
          {/* Previsualización de imagen */}
          <div>
            <span className="mb-1.5 block font-mono text-xs text-ink-muted">Imagen</span>
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-surface-2 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {form.image && !imgFailed ? (
                <img src={form.image} alt="" onError={() => setImgFailed(true)} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-faint">
                  <ImageOff size={22} strokeWidth={1.5} />
                  <span className="px-4 text-center font-mono text-[11px]">Toca para seleccionar imagen</span>
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <span className="font-mono text-sm text-white">Subiendo...</span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setImgFailed(false);
                try {
                  const fd = new FormData();
                  fd.append("file", file);
                  const data = await apiFetch<{ url: string }>("/uploads", { method: "POST", body: fd });
                  if (data?.url) setForm({ ...form, image: data.url });
                } catch (err) {
                  // Silencioso: marcar fallo de imagen
                  setImgFailed(true);
                } finally {
                  setUploading(false);
                }
              }}
            />
          </div>

          {/* Datos principales */}
          <div className="space-y-4">
            <FormField label="Título" htmlFor="p-title" error={errors.title}>
              <input
                id="p-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                placeholder="Ej. Cancel Corredizo Minimalista"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Categoría" htmlFor="p-category" error={errors.categorySlug}>
                <select
                  id="p-category"
                  value={form.categorySlug}
                  onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                  className={`${inputClass} appearance-none`}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Estado" htmlFor="p-status">
                <select
                  id="p-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="active">Publicado</option>
                  <option value="draft">Borrador</option>
                </select>
              </FormField>
            </div>

            <FormField label="Slug" htmlFor="p-slug">
              <input
                id="p-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                placeholder="se genera automáticamente del título si lo dejas vacío"
                className={`${inputClass} font-mono text-xs`}
              />
            </FormField>
          </div>
        </div>

        <FormField label="Descripción" htmlFor="p-desc" error={errors.description}>
          <textarea
            id="p-desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Descripción breve del producto, como aparece en la tarjeta de catálogo..."
          />
        </FormField>

        <FormField label="Especificaciones técnicas" htmlFor="p-specs">
          <SpecListEditor specs={form.specs} onChange={(specs) => setForm({ ...form, specs })} />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ink-muted transition-colors hover:text-ink">
            Cancelar
          </button>
          <button type="submit" className="rounded-full bg-accent px-5 py-2 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]">
            {initial ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
