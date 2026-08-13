import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { BlogFormModal } from "@/components/forms/BlogFormModal";
import { useData } from "@/context/DataContext";
import type { BlogPost } from "@/lib/types";

export function BlogPage() {
  const { posts, addPost, updatePost, deletePost } = useData();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [toDelete, setToDelete] = useState<BlogPost | null>(null);
  const [preview, setPreview] = useState<BlogPost | null>(null);

  const columns: Column<BlogPost>[] = [
    {
      header: "Artículo",
      cell: (p) => (
        <div className="flex items-center gap-3">
          <div className={`h-10 w-14 shrink-0 rounded-lg bg-gradient-to-br ${p.accent} border border-line`} />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{p.title}</p>
            <p className="truncate font-mono text-xs text-ink-faint">{p.category}</p>
          </div>
        </div>
      ),
    },
    { header: "Fecha", cell: (p) => <span className="font-mono text-xs text-ink-faint">{p.date}</span> },
    { header: "Vistas", cell: (p) => <span className="font-mono text-xs text-ink-muted">{p.views.toLocaleString("es-MX")}</span> },
    { header: "Estado", cell: (p) => <StatusBadge active={p.status === "published"} labels={["Publicado", "Borrador"]} /> },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Contenido"
        title="Blog / Noticias"
        description="Artículos de tendencias, mantenimiento y guías técnicas para la landing."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            <Plus size={16} /> Nuevo artículo
          </button>
        }
      />

      <DataTable
        data={posts}
        rowKey={(p) => p.id}
        columns={columns}
        searchPlaceholder="Buscar artículo..."
        searchFn={(p, q) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)}
        emptyTitle="Sin artículos"
        emptyDescription="Publica la primera entrada del blog."
        actions={(p) => (
          <>
            <IconButton icon={Eye} label="Vista previa" onClick={() => setPreview(p)} />
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

      <BlogFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSave={(p) => (editing ? updatePost(p) : addPost(p))}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && deletePost(toDelete.id)}
        title="Eliminar artículo"
        description={`"${toDelete?.title}" se quitará del blog de la landing. Esta acción no se puede deshacer.`}
      />

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Vista previa" size="lg">
        {preview && (
          <div>
            <div className={`h-40 rounded-xl border border-line bg-gradient-to-br ${preview.accent}`} />
            <span className="mt-4 inline-block rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-accent2">
              {preview.category}
            </span>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">{preview.title}</h3>
            <p className="mt-2 font-body text-sm text-ink-muted">{preview.excerpt}</p>
            <p className="mt-4 whitespace-pre-line font-body text-sm leading-relaxed text-ink">{preview.content}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
