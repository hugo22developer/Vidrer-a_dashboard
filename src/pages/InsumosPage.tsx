import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Boxes, RefreshCw, Gauge, AlertTriangle, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InsumoFormModal } from "@/components/insumos/InsumoFormModal";
import { BulkPriceUpdateModal } from "@/components/insumos/BulkPriceUpdateModal";
import { useData } from "@/context/DataContext";
import { formatMXN } from "@/lib/quoteConfig";
import type { Insumo } from "@/lib/insumoTypes";

const CATEGORY_TONE: Record<string, string> = {
  "Perfiles de Aluminio": "bg-accent2/15 text-accent2",
  "Cristales / Vidrios": "bg-accent/15 text-accent",
  "Herrajes y Accesorios": "bg-success/15 text-success",
  "Consumibles / Selladores": "bg-ink-muted/15 text-ink-muted",
};

function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

export function InsumosPage() {
  const { insumos, addInsumo, updateInsumo, deleteInsumo, bulkUpdateInsumoPrices } = useData();
  const [formOpen, setFormOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editing, setEditing] = useState<Insumo | null>(null);
  const [toDelete, setToDelete] = useState<Insumo | null>(null);

  const metrics = useMemo(() => {
    const recientes = insumos.filter((i) => daysAgo(i.ultimaModificacion) <= 30).length;
    const perfiles = insumos.filter((i) => i.categoria === "Perfiles de Aluminio" && i.unidad === "m");
    const costoPromedioPerfil = perfiles.length ? perfiles.reduce((s, i) => s + i.costoUnitario, 0) / perfiles.length : 0;
    const pendientes = insumos.filter((i) => i.pendingReview).length;
    return { total: insumos.length, recientes, costoPromedioPerfil, pendientes };
  }, [insumos]);

  const columns: Column<Insumo>[] = [
    {
      header: "Insumo",
      cell: (i) => (
        <div>
          <p className="font-medium text-ink">{i.nombre}</p>
          <p className="font-mono text-xs text-ink-faint">{i.sku}</p>
        </div>
      ),
    },
    {
      header: "Categoría",
      cell: (i) => (
        <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${CATEGORY_TONE[i.categoria]}`}>{i.categoria}</span>
      ),
    },
    { header: "Unidad", cell: (i) => <span className="font-mono text-xs text-ink-muted">{i.unidad}</span> },
    {
      header: "Costo unitario",
      cell: (i) => (
        <div className="flex items-center gap-1.5">
          <span className="font-display text-sm font-semibold text-ink">{formatMXN(i.costoUnitario)}</span>
          {i.pendingReview && <AlertTriangle size={13} className="text-accent" aria-label="Variación de precio pendiente" />}
        </div>
      ),
    },
    { header: "Última mod.", cell: (i) => <span className="font-mono text-xs text-ink-faint">{i.ultimaModificacion}</span> },
    { header: "Estado", cell: (i) => <StatusBadge active={i.estado === "active"} labels={["Activo", "Descontinuado"]} /> },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Costos"
        title="Insumos y Materia Prima"
        description="Materiales que alimentan el cálculo de costos de cada cotización."
        action={
          <div className="flex gap-2.5">
            <button
              onClick={() => setBulkOpen(true)}
              className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 font-body text-sm text-ink-muted transition-colors hover:border-accent2/50 hover:text-accent2"
            >
              <SlidersHorizontal size={15} /> Actualización masiva
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
            >
              <Plus size={16} /> Nuevo insumo
            </button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Boxes} label="Insumos registrados" value={String(metrics.total)} index={0} />
        <MetricCard icon={RefreshCw} label="Actualizados (30 días)" value={String(metrics.recientes)} index={1} />
        <MetricCard icon={Gauge} label="Costo prom. perfilería / m" value={formatMXN(metrics.costoPromedioPerfil)} index={2} />
        <MetricCard
          icon={AlertTriangle}
          label="Con variación pendiente"
          value={String(metrics.pendientes)}
          sublabel={metrics.pendientes > 0 ? "Requieren confirmación de proveedor" : "Todo al día"}
          index={3}
        />
      </div>

      <DataTable
        data={insumos}
        rowKey={(i) => i.id}
        columns={columns}
        searchPlaceholder="Buscar por nombre o SKU..."
        searchFn={(i, q) => i.nombre.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)}
        emptyTitle="Sin insumos"
        emptyDescription="Registra el primer insumo para empezar a costear tus cotizaciones."
        actions={(i) => (
          <>
            <IconButton
              icon={Pencil}
              label="Editar"
              onClick={() => {
                setEditing(i);
                setFormOpen(true);
              }}
            />
            <IconButton icon={Trash2} label="Eliminar" variant="danger" onClick={() => setToDelete(i)} />
          </>
        )}
      />

      <InsumoFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSave={(i) => (editing ? updateInsumo(i) : addInsumo(i))}
      />

      <BulkPriceUpdateModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        insumos={insumos}
        onApply={bulkUpdateInsumoPrices}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && deleteInsumo(toDelete.id)}
        title="Eliminar insumo"
        description={`"${toDelete?.nombre}" se quitará del catálogo de materia prima. Las cotizaciones ya generadas no se ven afectadas.`}
      />
    </div>
  );
}
