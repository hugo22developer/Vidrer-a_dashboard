import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, PackageSearch } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CategoryFormModal } from "@/components/forms/CategoryFormModal";
import { useData } from "@/context/DataContext";
import type { Category } from "@/lib/types";

export function CategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useData();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  return (
    <div>
      <PageHeader
        eyebrow="Catálogo"
        title="Categorías principales"
        description="Las 4 líneas que estructuran el catálogo de la landing."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            <Plus size={16} /> Nueva categoría
          </button>
        }
      />

      {categories.length === 0 ? (
        <EmptyState icon={PackageSearch} title="Sin categorías" description="Crea la primera línea de catálogo para empezar a agregar productos." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat, i) => {
            const productCount = products.filter((p) => p.categorySlug === cat.slug).length;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${cat.accent} p-5`}
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-line bg-surface/70 px-2.5 py-1 font-mono text-[11px] text-accent2">
                    {cat.eyebrow}
                  </span>
                  <span className="font-mono text-xs text-ink-faint">/catalogo/{cat.slug}</span>
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{cat.label}</h3>
                <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-ink-muted">{cat.heroDescription}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.heroSpecs.slice(0, 3).map((spec) => (
                    <span key={spec} className="rounded-full border border-line bg-surface/70 px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <span className="font-mono text-xs text-ink-faint">{productCount} producto{productCount !== 1 ? "s" : ""}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setEditing(cat);
                        setFormOpen(true);
                      }}
                      aria-label="Editar categoría"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface/70 text-ink-muted transition-colors hover:border-accent2/50 hover:text-accent2"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setToDelete(cat)}
                      aria-label="Eliminar categoría"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface/70 text-ink-muted transition-colors hover:border-danger/50 hover:text-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        existingSlugs={categories.map((c) => c.slug)}
        onSave={(c) => (editing ? updateCategory(c) : addCategory(c))}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && deleteCategory(toDelete.slug)}
        title="Eliminar categoría"
        description={`Se eliminará "${toDelete?.label}" y todos sus productos asociados de la landing. Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
