import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  header: string;
  /** Render de la celda para esa fila */
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;
  actions?: (row: T) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbarExtra?: ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  searchPlaceholder = "Buscar...",
  searchFn,
  actions,
  emptyTitle = "Sin resultados",
  emptyDescription = "No hay registros que coincidan con tu búsqueda.",
  toolbarExtra,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim() || !searchFn) return data;
    return data.filter((row) => searchFn(row, query.trim().toLowerCase()));
  }, [data, query, searchFn]);

  return (
    <div className="glass-panel rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        {searchFn ? (
          <div className="relative w-full max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-line bg-surface-2 py-2 pl-9 pr-3 font-body text-sm text-ink outline-none placeholder:text-ink-faint focus:border-accent2"
            />
          </div>
        ) : (
          <span />
        )}
        {toolbarExtra}
      </div>

      {filtered.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className="whitespace-nowrap px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest text-ink-faint"
                  >
                    {col.header}
                  </th>
                ))}
                {actions && (
                  <th className="whitespace-nowrap px-4 py-3 text-right font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <motion.tr
                  key={rowKey(row)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03 }}
                  className="border-t border-line transition-colors hover:bg-surface-2/60"
                >
                  {columns.map((col) => (
                    <td key={col.header} className={`px-4 py-3.5 align-middle font-body text-sm text-ink ${col.className ?? ""}`}>
                      {col.cell(row)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">{actions(row)}</div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
