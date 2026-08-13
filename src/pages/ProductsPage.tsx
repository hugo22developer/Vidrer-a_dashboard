import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProductFormModal } from "@/components/forms/ProductFormModal";
import { useData } from "@/context/DataContext";
import type { Product } from "@/lib/types";

function ThumbCell({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
      {!failed && product.image ? (
        <img src={product.image} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-ink-faint">
          <ImageOff size={14} />
        </div>
      )}
    </div>
  );
}

export function ProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useData();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const filtered = useMemo(
    () => (activeCategory === "all" ? products : products.filter((p) => p.categorySlug === activeCategory)),
    [products, activeCategory]
  );

  const categoryLabel = (slug: string) => categories.find((c) => c.slug === slug)?.shortLabel ?? slug;

  const columns: Column<Product>[] = [
    {
      header: "Producto",
      cell: (p) => (
        <div className="flex items-center gap-3">
          <ThumbCell product={p} />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{p.title}</p>
            <p className="truncate font-mono text-xs text-ink-faint">{categoryLabel(p.categorySlug)}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Specs",
      cell: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.specs.slice(0, 2).map((s) => (
            <span key={s} className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-ink-muted">
              {s}
            </span>
          ))}
          {p.specs.length > 2 && <span className="font-mono text-[10px] text-ink-faint">+{p.specs.length - 2}</span>}
        </div>
      ),
    },
    { header: "Consultas", cell: (p) => <span className="font-mono text-xs text-ink-muted">{p.consultations}</span> },
    { header: "Estado", cell: (p) => <StatusBadge active={p.status === "active"} labels={["Publicado", "Borrador"]} /> },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Catálogo"
        title="Productos por categoría"
        description="Todos los productos que se muestran en las páginas internas de la landing."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            <Plus size={16} /> Nuevo producto
          </button>
        }
      />

      {/* Filtro por categoría */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
            activeCategory === "all" ? "border-accent2/50 bg-accent2/10 text-accent2" : "border-line text-ink-muted hover:text-ink"
          }`}
        >
          Todas ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.categorySlug === cat.slug).length;
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                activeCategory === cat.slug ? "border-accent2/50 bg-accent2/10 text-accent2" : "border-line text-ink-muted hover:text-ink"
              }`}
            >
              {cat.shortLabel} ({count})
            </button>
          );
        })}
      </div>

      <DataTable
        data={filtered}
        rowKey={(p) => p.id}
        columns={columns}
        searchPlaceholder="Buscar producto..."
        searchFn={(p, q) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)}
        emptyTitle="Sin productos"
        emptyDescription="Agrega el primer producto de esta categoría."
        actions={(p) => (
          <>
            <IconButton
              icon={Pencil}
              label="Editar"
              onClick={() => {
                setEditing(p);
                setFormOpen(true);
              }}
            />
            <IconButton icon={Trash2} label="Eliminar" variant="danger" onClick={() => setToDelete(p)} />
          </>
        )}
      />

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        categories={categories}
        defaultCategorySlug={activeCategory !== "all" ? activeCategory : undefined}
        onSave={(p) => (editing ? updateProduct(p) : addProduct(p))}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && deleteProduct(toDelete.id)}
        title="Eliminar producto"
        description={`"${toDelete?.title}" se quitará del catálogo de la landing. Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
