import { Download, FileDown, RefreshCcw } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { downloadQuotePdf } from "@/lib/api";
import { formatMXN } from "@/lib/quoteConfig";
import { generarVistaPreviaPDF } from "@/lib/quotePdf";
import type { ClientData, QuoteItem } from "@/lib/quoteTypes";

interface QuotePreviewModalProps {
  open: boolean;
  onClose: () => void;
  client: ClientData;
  cart: QuoteItem[];
  ivaPercent: number;
  onIvaChange: (value: number) => void;
  totals: { subtotal: number; iva: number; total: number };
  onReset: () => void;
  quoteMeta?: { id: string; folio: string; createdAt: string } | null;
}

const QUOTE_NUMBER = "COT-PENDIENTE";
const ISSUE_DATE = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
const VALID_UNTIL = new Date(Date.now() + 7 * 86400000).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });

export function QuotePreviewModal({ open, onClose, client, cart, ivaPercent, onIvaChange, totals, onReset, quoteMeta }: QuotePreviewModalProps) {
  const issueDate = quoteMeta?.createdAt
    ? new Date(quoteMeta.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })
    : ISSUE_DATE;

  async function handleDownloadPdf() {
    if (!quoteMeta) return;
    try {
      await downloadQuotePdf(quoteMeta.id, `${quoteMeta.folio}.pdf`);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo descargar el PDF");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Vista previa de la cotización" size="lg">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-2.5">
        <label className="flex items-center gap-2 font-mono text-xs text-ink-muted">
          IVA (%)
          <input
            type="number"
            min={0}
            max={100}
            value={ivaPercent}
            onChange={(e) => onIvaChange(Math.max(0, Number(e.target.value) || 0))}
            className="w-16 rounded-lg border border-line bg-surface px-2 py-1 text-center font-mono text-xs text-ink outline-none focus:border-accent2"
          />
        </label>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={() =>
              generarVistaPreviaPDF({
                client,
                cart,
                ivaPercent,
                totals,
                folio: quoteMeta?.folio,
                issueDate,
                validUntil: VALID_UNTIL,
              })
            }
            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-display text-xs font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            <Download size={13} /> Vista previa / Imprimir
          </button>
          {quoteMeta && (
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 rounded-full border border-accent2/40 bg-accent2/5 px-4 py-2 font-display text-xs font-semibold text-accent2 transition-colors hover:bg-accent2/10"
            >
              <FileDown size={13} /> Descargar PDF
            </button>
          )}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-body text-xs text-ink-muted transition-colors hover:text-ink"
          >
            <RefreshCcw size={13} /> Nueva cotización
          </button>
        </div>
      </div>

      {/* Resumen en pantalla — el documento formal imprimible se genera con generarVistaPreviaPDF() */}
      <div id="quote-print-area" className="rounded-2xl border border-line bg-surface-2 p-6 sm:p-8">
        <div className="flex items-start justify-between border-b border-line pb-5">
          <div className="flex items-center gap-3">
            <svg width="34" height="34" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="24" height="24" rx="5" stroke="var(--color-accent2)" strokeWidth="1.4" />
              <path d="M9 1V25M17 1V25" stroke="var(--color-ink-faint)" strokeWidth="1.2" />
              <path d="M1 13H25" stroke="var(--color-ink-faint)" strokeWidth="1.2" opacity="0.5" />
            </svg>
            <div>
              <p className="font-display text-base font-semibold text-ink">El Cercho</p>
              <p className="font-mono text-[10px] text-ink-faint">Carpintería de Aluminio y Vidrio</p>
              <p className="mt-1 font-body text-[11px] text-ink-muted">
                Parque Industrial, McAllen / Reynosa · hola@elcercho.mx · +52 55 0000 0000
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-ink-faint">Cotización</p>
            <p className="font-display text-sm font-semibold text-ink">{quoteMeta?.folio ?? QUOTE_NUMBER}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-faint">Emitida: {issueDate}</p>
            <p className="font-mono text-[10px] text-ink-faint">Vigente hasta: {VALID_UNTIL}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-b border-line py-5 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Cliente</p>
            <p className="mt-1 font-body text-sm font-medium text-ink">{client.name || "—"}</p>
            <p className="font-body text-xs text-ink-muted">{client.phone}</p>
            <p className="font-body text-xs text-ink-muted">{client.email}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Dirección de obra</p>
            <p className="mt-1 font-body text-xs text-ink-muted">{client.address || "—"}</p>
            <p className="font-body text-xs text-ink-muted">{client.postalCode}</p>
          </div>
        </div>

        <div className="py-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Desglose técnico</p>
          <div className="space-y-3">
            {cart.map((item, i) => (
              <div key={item.id} className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-0">
                <div>
                  <p className="font-body text-sm font-medium text-ink">
                    {i + 1}. {item.categoryLabel} {item.subtypeLabel}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                    {item.widthCm}×{item.heightCm}cm · {item.areaM2.toFixed(2)}m² · {item.lineaLabel} · {item.acabadoLabel} · {item.vidrioLabel}
                    {item.herrajeLabels.length > 0 && ` · ${item.herrajeLabels.join(", ")}`}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                    Cantidad: {item.quantity} × {formatMXN(item.unitPrice)}
                  </p>
                </div>
                <p className="shrink-0 font-display text-sm font-semibold text-ink">{formatMXN(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ml-auto max-w-[240px] space-y-1.5 border-t border-line pt-4">
          <div className="flex justify-between font-body text-sm text-ink-muted">
            <span>Subtotal</span>
            <span className="font-mono">{formatMXN(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between font-body text-sm text-ink-muted">
            <span>IVA ({ivaPercent}%)</span>
            <span className="font-mono">{formatMXN(totals.iva)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-1.5 font-display text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatMXN(totals.total)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-surface p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Condiciones comerciales</p>
          <ul className="mt-2 space-y-1 font-body text-[11px] text-ink-muted">
            <li>· Anticipo del 50% para iniciar fabricación, saldo contra entrega.</li>
            <li>· Cotización vigente por 7 días naturales a partir de la fecha de emisión.</li>
            <li>· Tiempo de entrega estimado: 2 a 3 semanas a partir de la confirmación del anticipo.</li>
            <li>· Precios en pesos mexicanos, sujetos a revisión de medidas en sitio.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
