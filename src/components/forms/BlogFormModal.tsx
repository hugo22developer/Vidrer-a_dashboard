import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField, inputClass } from "@/components/ui/FormField";
import type { BlogPost, PostStatus } from "@/lib/types";

const ACCENTS = [
  { label: "Vidrio (cian)", value: "from-accent2/30 to-surface" },
  { label: "Ámbar", value: "from-accent/25 to-surface" },
  { label: "Acero (neutro)", value: "from-ink-muted/25 to-surface" },
];

interface BlogFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (post: BlogPost) => void;
  initial?: BlogPost | null;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const EMPTY: Omit<BlogPost, "id" | "views" | "date"> = {
  slug: "",
  category: "Tendencias",
  title: "",
  excerpt: "",
  content: "",
  accent: ACCENTS[0].value,
  status: "draft",
};

export function BlogFormModal({ open, onClose, onSave, initial }: BlogFormModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              slug: initial.slug,
              category: initial.category,
              title: initial.title,
              excerpt: initial.excerpt,
              content: initial.content,
              accent: initial.accent,
              status: initial.status,
            }
          : EMPTY
      );
      setErrors({});
    }
  }, [open, initial]);

  function validate() {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "El título es obligatorio.";
    if (!form.excerpt.trim()) next.excerpt = "Agrega un extracto.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: initial?.id ?? `b${Date.now()}`,
      views: initial?.views ?? 0,
      date: initial?.date ?? new Date().toISOString().slice(0, 10),
      ...form,
      slug: form.slug || slugify(form.title),
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={initial ? "Editar artículo" : "Nuevo artículo"}
      description="Contenido de la sección Blog / Noticias de la landing."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Título" htmlFor="b-title" error={errors.title}>
          <input
            id="b-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
            placeholder="Título del artículo"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Categoría" htmlFor="b-category">
            <input
              id="b-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass}
              placeholder="Tendencias / Mantenimiento / Guía técnica"
            />
          </FormField>
          <FormField label="Estado" htmlFor="b-status">
            <select
              id="b-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PostStatus })}
              className={`${inputClass} appearance-none`}
            >
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
            </select>
          </FormField>
        </div>

        <FormField label="Extracto (resumen en tarjeta)" htmlFor="b-excerpt" error={errors.excerpt}>
          <textarea
            id="b-excerpt"
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className={`${inputClass} resize-none`}
          />
        </FormField>

        <FormField label="Contenido completo" htmlFor="b-content">
          <textarea
            id="b-content"
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Cuerpo completo del artículo..."
          />
        </FormField>

        <FormField label="Acento visual de la tarjeta" htmlFor="b-accent">
          <div className="flex gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => setForm({ ...form, accent: a.value })}
                className={`flex-1 rounded-xl border bg-gradient-to-br px-3 py-2.5 text-left font-mono text-[11px] transition-colors ${a.value} ${
                  form.accent === a.value ? "border-accent2" : "border-line"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ink-muted transition-colors hover:text-ink">
            Cancelar
          </button>
          <button type="submit" className="rounded-full bg-accent px-5 py-2 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]">
            {initial ? "Guardar cambios" : "Publicar artículo"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
