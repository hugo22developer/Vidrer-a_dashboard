import type { ClientData, QuoteItem } from "./quoteTypes";

/**
 * Generación de la vista previa / hoja de cotización formal en el frontend.
 * `generarVistaPreviaPDF()` inyecta los datos del carrito en una plantilla
 * HTML autocontenida (con bocetos técnicos SVG dinámicos por partida) y la
 * abre en una ventana lista para imprimir o guardar como PDF.
 */

// Paleta industrial-elegante
const STROKE = "#334155";
const ACCENT = "#0891b2";
const FILL = "#f1f5f9";
const GLASS = "#e6f3fc";
const HATCH = "#94a3b8";
const LABEL_COLOR = "#475569";

const CANVAS_W = 200;
const CANVAS_H = 120;
const AREA_X = 20;
const AREA_Y = 18;
const AREA_W = 172;
const AREA_H = 84;

export function formatMoney(value: number): string {
  return "$" + value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDateES(date: Date): string {
  return date.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
}

// ---------------------------------------------------------------------------
// Bocetos técnicos (SVG)
// ---------------------------------------------------------------------------

type SketchKind = "sliding" | "hinged" | "projecting" | "fixed" | "cabinet";

function sketchKind(item: QuoteItem): SketchKind {
  const label = (item.subtypeLabel ?? "").toLowerCase();
  if (label.includes("corrediz")) return "sliding";
  if (label.includes("abatible")) return "hinged";
  if (label.includes("proyectante")) return "projecting";
  if (label.includes("fijo") || label.includes("mampara")) return "fixed";
  if (item.categoryId === "mueble") return "cabinet";
  return "sliding";
}

function r1(v: number): string {
  return v.toFixed(1);
}

function arrowhead(x: number, y: number, angleDeg: number, size = 4.5): string {
  const a = (angleDeg * Math.PI) / 180;
  const tip = [x + size * Math.cos(a), y + size * Math.sin(a)];
  const b1 = a + (160 * Math.PI) / 180;
  const b2 = a - (160 * Math.PI) / 180;
  const p1 = [x + size * Math.cos(b1), y + size * Math.sin(b1)];
  const p2 = [x + size * Math.cos(b2), y + size * Math.sin(b2)];
  const pts = [tip, p1, p2].map((p) => `${r1(p[0])},${r1(p[1])}`).join(" ");
  return `<polygon points="${pts}" fill="${STROKE}"/>`;
}

function dblArrow(x1: number, y1: number, x2: number, y2: number): string {
  return (
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${STROKE}" stroke-width="1"/>` +
    arrowhead(x2, y2, 0) +
    arrowhead(x1, y1, 180)
  );
}

function arcPoints(cx: number, cy: number, radius: number, startDeg: number, endDeg: number, steps = 16): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((startDeg + ((endDeg - startDeg) * i) / steps) * Math.PI) / 180;
    pts.push([cx + radius * Math.cos(a), cy + radius * Math.sin(a)]);
  }
  return pts;
}

function polyline(points: Array<[number, number]>, stroke = ACCENT, width = 1.2, fill = "none", dash = ""): string {
  const data = points.map((p) => `${r1(p[0])},${r1(p[1])}`).join(" ");
  const dashAttr = dash ? ` stroke-dasharray="${dash}"` : "";
  return `<polyline points="${data}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"${dashAttr}/>`;
}

function hingeCircle(cx: number, cy: number): string {
  return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="1.9" fill="${ACCENT}"/>`;
}

function body(kind: SketchKind, x: number, y: number, rw: number, rh: number, cx: number): string {
  const panel = `<rect x="${r1(x + 4)}" y="${r1(y + 3)}" width="${r1(rw - 8)}" height="${r1(rh - 6)}" fill="#ffffff" stroke="${ACCENT}" stroke-width="1"/>`;

  if (kind === "sliding") {
    const p1 = `<rect x="${r1(x + 2)}" y="${r1(y + 2)}" width="${r1(rw * 0.54)}" height="${r1(rh - 4)}" fill="none" stroke="${ACCENT}" stroke-width="1"/>`;
    const p2 = `<rect x="${r1(x + rw * 0.46)}" y="${r1(y + 2)}" width="${r1(rw * 0.54)}" height="${r1(rh - 4)}" fill="none" stroke="${HATCH}" stroke-width="1"/>`;
    const h1 = `<line x1="${r1(x + rw * 0.27)}" y1="${r1(y + rh * 0.44)}" x2="${r1(x + rw * 0.27)}" y2="${r1(y + rh * 0.56)}" stroke="${ACCENT}" stroke-width="1.6"/>`;
    const h2 = `<line x1="${r1(x + rw * 0.73)}" y1="${r1(y + rh * 0.44)}" x2="${r1(x + rw * 0.73)}" y2="${r1(y + rh * 0.56)}" stroke="${ACCENT}" stroke-width="1.6"/>`;
    return p1 + p2 + h1 + h2 + dblArrow(x + rw * 0.12, y + rh * 0.92, x + rw * 0.88, y + rh * 0.92);
  }

  if (kind === "hinged") {
    const arc = arcPoints(x + 4, y + rh / 2, rw - 6, -58, 58);
    const wedge: Array<[number, number]> = [[x + 4, y + rh / 2], ...arc, [x + 4, y + rh / 2]];
    const mid = arc[Math.floor(arc.length / 2)];
    return (
      panel +
      polyline(wedge, ACCENT, 1.2, "rgba(8,145,178,0.08)", "3,2") +
      arrowhead(mid[0], mid[1], 90) +
      hingeCircle(x + 4, y + rh * 0.25) +
      hingeCircle(x + 4, y + rh * 0.75)
    );
  }

  if (kind === "projecting") {
    const arc = arcPoints(cx, y + rh - 4, rh - 8, -140, -40);
    const wedge: Array<[number, number]> = [[cx, y + rh - 4], ...arc, [cx, y + rh - 4]];
    const end = arc[arc.length - 1];
    return (
      panel +
      polyline(wedge, ACCENT, 1.2, "rgba(8,145,178,0.08)", "3,2") +
      arrowhead(end[0], end[1], 50) +
      hingeCircle(x + rw * 0.35, y + rh - 4) +
      hingeCircle(x + rw * 0.65, y + rh - 4)
    );
  }

  if (kind === "fixed") {
    const brace =
      `<line x1="${r1(x)}" y1="${r1(y)}" x2="${r1(x + rw)}" y2="${r1(y + rh)}" stroke="${HATCH}" stroke-width="1" stroke-dasharray="4,2"/>` +
      `<line x1="${r1(x)}" y1="${r1(y + rh)}" x2="${r1(x + rw)}" y2="${r1(y)}" stroke="${HATCH}" stroke-width="1" stroke-dasharray="4,2"/>`;
    return `<rect x="${r1(x + 3)}" y="${r1(y + 3)}" width="${r1(rw - 6)}" height="${r1(rh - 6)}" fill="none" stroke="${ACCENT}" stroke-width="1"/>${brace}`;
  }

  const divider = `<line x1="${r1(cx)}" y1="${r1(y + 2)}" x2="${r1(cx)}" y2="${r1(y + rh - 2)}" stroke="${STROKE}" stroke-width="1"/>`;
  const shelf = `<line x1="${r1(x + 2)}" y1="${r1(y + rh * 0.3)}" x2="${r1(x + rw - 2)}" y2="${r1(y + rh * 0.3)}" stroke="${HATCH}" stroke-width="1" stroke-dasharray="4,2"/>`;
  const h1 = `<line x1="${r1(cx - 4)}" y1="${r1(y + rh * 0.62)}" x2="${r1(cx - 4)}" y2="${r1(y + rh * 0.72)}" stroke="${ACCENT}" stroke-width="1.6"/>`;
  const h2 = `<line x1="${r1(cx + 4)}" y1="${r1(y + rh * 0.62)}" x2="${r1(cx + 4)}" y2="${r1(y + rh * 0.72)}" stroke="${ACCENT}" stroke-width="1.6"/>`;
  return divider + shelf + h1 + h2;
}

const KIND_LABELS: Record<SketchKind, string> = {
  sliding: "CORREDIZA · 2 HOJAS",
  hinged: "ABATIBLE · SENTIDO DE APERTURA",
  projecting: "PROYECTANTE",
  fixed: "FIJO / MAMPARA",
  cabinet: "VITRINA / CLÓSET",
};

/** SVG dinámico que representa la partida (se adapta a sus dimensiones). */
export function itemSketchSvg(item: QuoteItem): string {
  let w = item.widthCm || 100;
  let h = item.heightCm || 100;

  const scale = Math.min(AREA_W / w, AREA_H / h);
  const rw = w * scale;
  const rh = h * scale;
  const x = AREA_X + (AREA_W - rw) / 2;
  const y = AREA_Y + (AREA_H - rh) / 2;
  const cx = x + rw / 2;
  const cy = y + rh / 2;

  const kind = sketchKind(item);
  const wLabel = `${w} cm`;
  const hLabel = `${h} cm`;

  const dims =
    `<line x1="${r1(x)}" y1="${r1(AREA_Y - 7)}" x2="${r1(x + rw)}" y2="${r1(AREA_Y - 7)}" stroke="${LABEL_COLOR}" stroke-width="0.8"/>` +
    arrowhead(x + rw, AREA_Y - 7, 0, 3.4) +
    arrowhead(x, AREA_Y - 7, 180, 3.4) +
    `<text x="${r1(cx)}" y="${r1(AREA_Y - 12)}" text-anchor="middle" font-size="7" fill="${LABEL_COLOR}" font-family="sans-serif">${wLabel}</text>` +
    `<line x1="${r1(AREA_X - 7)}" y1="${r1(y)}" x2="${r1(AREA_X - 7)}" y2="${r1(y + rh)}" stroke="${LABEL_COLOR}" stroke-width="0.8"/>` +
    arrowhead(AREA_X - 7, y + rh, 90, 3.4) +
    arrowhead(AREA_X - 7, y, -90, 3.4) +
    `<text transform="translate(${r1(AREA_X - 14)},${r1(cy)}) rotate(-90)" text-anchor="middle" font-size="7" fill="${LABEL_COLOR}" font-family="sans-serif">${hLabel}</text>`;

  const frame =
    `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(rw)}" height="${r1(rh)}" fill="${FILL}" stroke="${STROKE}" stroke-width="1.5"/>` +
    `<rect x="${r1(x + 2)}" y="${r1(y + 2)}" width="${r1(rw - 4)}" height="${r1(rh - 4)}" fill="${GLASS}" stroke="none"/>`;

  const title = `<text x="${CANVAS_W / 2}" y="${CANVAS_H - 6}" text-anchor="middle" font-size="7.5" fill="${STROKE}" font-family="sans-serif" font-weight="bold" letter-spacing="1">${KIND_LABELS[kind]}</text>`;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" width="100%" height="100%" role="img" aria-label="Boceto técnico de ${KIND_LABELS[kind]}">` +
    dims + frame + body(kind, x, y, rw, rh, cx) + title +
    `</svg>`
  );
}

// ---------------------------------------------------------------------------
// Plantilla HTML de la hoja formal
// ---------------------------------------------------------------------------

export interface QuotePdfData {
  client: ClientData;
  cart: QuoteItem[];
  ivaPercent: number;
  totals: { subtotal: number; iva: number; total: number };
  folio?: string;
  issueDate?: string;
  validUntil?: string;
}

function companyLogo(): string {
  return `<svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:44px;height:44px;">
    <rect x="1" y="1" width="24" height="24" rx="5" stroke="#0891b2" stroke-width="1.4"/>
    <path d="M9 1V25M17 1V25" stroke="#94a3b8" stroke-width="1.2"/>
    <path d="M1 13H25" stroke="#94a3b8" stroke-width="1.2" opacity="0.5"/>
  </svg>`;
}

export function buildQuotePdfHtml(data: QuotePdfData): string {
  const { client, cart, ivaPercent, totals } = data;
  const folio = data.folio ?? "COT-PENDIENTE";
  const issueDate = data.issueDate ?? formatDateES(new Date());
  const validUntil = data.validUntil ?? formatDateES(new Date(Date.now() + 7 * 86400000));

  const rows = cart
    .map(
      (item, i) => `
      <tr>
        <td class="id">${i + 1}</td>
        <td>
          <p class="item-name">${escapeHtml(item.categoryLabel)} · ${escapeHtml(item.subtypeLabel)}</p>
          <table class="inner"><tr>
            <td class="col col-desc">
              <p class="spec"><b>Área:</b> ${item.areaM2.toFixed(2)} m² · <b>Cant. mínima facturable:</b> ${item.billableAreaM2.toFixed(2)} m²</p>
              <p class="spec"><b>Sistema:</b> ${escapeHtml(item.lineaLabel)}</p>
              <p class="spec"><b>Color / Acabado:</b> ${escapeHtml(item.acabadoLabel)}</p>
              <p class="spec"><b>Vidrio:</b> ${escapeHtml(item.vidrioLabel)}</p>
              <p class="spec"><b>Herrajes:</b> ${item.herrajeLabels.length ? escapeHtml(item.herrajeLabels.join(", ")) : "—"}</p>
            </td>
            <td class="col col-svg">${itemSketchSvg(item)}</td>
          </tr></table>
        </td>
        <td class="dim">${item.widthCm} × ${item.heightCm}</td>
        <td class="qty">${item.quantity}</td>
        <td class="price">${formatMoney(item.unitPrice)}</td>
        <td class="total">${formatMoney(item.subtotal)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Cotización ${folio}</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 22mm 16mm;
    @bottom-center { content: "Página " counter(page) " de " counter(pages); font-family: 'Inter','Segoe UI','Roboto','Helvetica Neue',Arial,sans-serif; font-size: 8pt; color: #64748b; }
    @bottom-right { content: "${folio} · ${issueDate}"; font-family: 'Inter','Segoe UI',Arial,sans-serif; font-size: 8pt; color: #94a3b8; }
    @bottom-left { content: "El Cercho · hola@elcercho.mx · +52 55 0000 0000"; font-family: 'Inter','Segoe UI',Arial,sans-serif; font-size: 8pt; color: #94a3b8; }
  }
  * { box-sizing: border-box; }
  body { font-family: 'Inter','Segoe UI','Roboto','Helvetica Neue',Arial,sans-serif; color: #1e293b; font-size: 10pt; margin: 0; }
  h1,h2,h3 { margin: 0; font-weight: 700; }
  p { margin: 0; }
  .sheet { width: 100%; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0891b2; padding-bottom: 12px; }
  .brand { display: flex; gap: 12px; align-items: center; }
  .brand-name { font-size: 16pt; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; }
  .brand-tag { font-size: 8pt; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; }
  .brand-contact { font-size: 8.5pt; color: #475569; margin-top: 3px; }
  .meta { text-align: right; }
  .meta .doc-type { font-size: 8pt; text-transform: uppercase; letter-spacing: 0.18em; color: #94a3b8; }
  .meta .folio { font-size: 14pt; font-weight: 800; color: #0891b2; margin-top: 2px; }
  .meta .dates { font-size: 8.5pt; color: #475569; margin-top: 4px; }
  .client-block { display: flex; gap: 24px; margin-top: 14px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
  .client-box { flex: 1; }
  .client-box .k { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.14em; color: #94a3b8; margin-bottom: 3px; }
  .client-box .v { font-size: 10pt; color: #1e293b; }
  .client-box .v.muted { color: #64748b; font-size: 9pt; }
  .section-title { font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #0891b2; margin: 16px 0 8px; }
  table.items { width: 100%; border-collapse: collapse; table-layout: fixed; }
  table.items thead th { background: #0f172a; color: #ffffff; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em; padding: 7px 6px; text-align: left; border: 1px solid #0f172a; }
  table.items tbody td { border: 1px solid #e2e8f0; padding: 8px 6px; vertical-align: top; font-size: 9pt; }
  table.items tbody tr { break-inside: avoid; page-break-inside: avoid; }
  td.id { text-align: center; font-weight: 700; color: #475569; }
  td.dim, td.qty, td.price, td.total { text-align: right; font-family: 'DejaVu Sans',Consolas,monospace; font-size: 9pt; }
  td.qty, td.dim { text-align: center; }
  .item-name { font-weight: 700; font-size: 9.5pt; color: #0f172a; }
  .spec { color: #475569; font-size: 8.5pt; margin-top: 3px; line-height: 1.5; }
  .spec b { color: #334155; }
  .inner { display: table; width: 100%; border-collapse: collapse; }
  .inner .col { display: table-cell; vertical-align: top; }
  .inner .col-desc { padding-right: 8px; }
  .inner .col-svg { width: 150px; }
  .col-svg svg { display: block; }
  .totals { margin-top: 12px; margin-left: auto; width: 240px; }
  .totals .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 9.5pt; color: #475569; }
  .totals .row.total { border-top: 2px solid #0f172a; margin-top: 4px; padding-top: 8px; font-weight: 800; color: #0f172a; font-size: 12pt; }
  .conditions { margin-top: 20px; border-top: 2px solid #0891b2; padding-top: 10px; }
  .conditions .section-title { margin-top: 0; }
  .cond-grid { display: table; width: 100%; border-collapse: collapse; }
  .cond-cell { display: table-cell; width: 50%; padding: 6px 12px 6px 0; vertical-align: top; }
  .cond-cell h3 { font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #0891b2; margin-bottom: 3px; }
  .cond-cell p { font-size: 8.5pt; color: #475569; line-height: 1.5; }
  .foot-note { margin-top: 14px; font-size: 7.5pt; color: #94a3b8; text-align: center; }
</style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div class="brand">
        ${companyLogo()}
        <div>
          <p class="brand-name">El Cercho</p>
          <p class="brand-tag">Carpintería de Aluminio y Vidrio</p>
          <p class="brand-contact">Parque Industrial, McAllen / Reynosa<br/>hola@elcercho.mx · +52 55 0000 0000</p>
        </div>
      </div>
      <div class="meta">
        <p class="doc-type">Cotización formal</p>
        <p class="folio">${folio}</p>
        <p class="dates">Emitida: ${issueDate}</p>
        <p class="dates">Vigente hasta: ${validUntil}</p>
      </div>
    </div>

    <div class="client-block">
      <div class="client-box">
        <p class="k">Cliente</p>
        <p class="v">${escapeHtml(client.name) || "—"}</p>
        <p class="v muted">${escapeHtml(client.phone)}</p>
        <p class="v muted">${escapeHtml(client.email)}</p>
      </div>
      <div class="client-box">
        <p class="k">Proyecto / Dirección de obra</p>
        <p class="v muted">${escapeHtml(client.address) || "—"}</p>
        <p class="v muted">C.P. ${escapeHtml(client.postalCode) || "—"}</p>
      </div>
    </div>

    <div class="section-title">Resumen de partidas</div>
    <table class="items">
      <thead>
        <tr>
          <th style="width:6%">#</th>
          <th style="width:44%">Descripción y especificaciones</th>
          <th style="width:12%">Medidas (cm)</th>
          <th style="width:8%">Cant.</th>
          <th style="width:15%">P. Unitario</th>
          <th style="width:15%">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="totals">
      <div class="row"><span>Subtotal</span><span>${formatMoney(totals.subtotal)}</span></div>
      <div class="row"><span>IVA (${ivaPercent}%)</span><span>${formatMoney(totals.iva)}</span></div>
      <div class="row total"><span>Total</span><span>${formatMoney(totals.total)}</span></div>
    </div>

    <div class="conditions">
      <div class="section-title">Notas y condiciones comerciales</div>
      <table class="cond-grid">
        <tr>
          <td class="cond-cell">
            <h3>Tiempo de fabricación</h3>
            <p>Fabricación en 2 a 3 semanas a partir de la confirmación del anticipo. La instalación se agenda en sitio según la disponibilidad de la obra.</p>
          </td>
          <td class="cond-cell">
            <h3>Condiciones de pago</h3>
            <p>Anticipo del 50% para iniciar fabricación y saldo contra entrega e instalación. Precios en pesos mexicanos (MXN).</p>
          </td>
        </tr>
        <tr>
          <td class="cond-cell">
            <h3>Garantía</h3>
            <p>12 meses contra defectos de fabricación e instalación. Garantía de herrajes conforme al fabricante. No se cubren daños por mal uso, manipulación o agentes externos.</p>
          </td>
          <td class="cond-cell">
            <h3>Exclusiones</h3>
            <p>No incluye trabajos de albañilería, pintura, acabados de muros ni adecuaciones necesarias para el ajuste de marcos. Medidas verificadas en sitio al momento de la instalación.</p>
          </td>
        </tr>
        <tr>
          <td class="cond-cell">
            <h3>Vigencia</h3>
            <p>Cotización vigente por 7 días naturales a partir de la fecha de emisión. Los precios quedan sujetos a verificación de medidas en sitio.</p>
          </td>
          <td class="cond-cell">
            <h3>Nota</h3>
            <p>Este documento es una propuesta comercial y no constituye un contrato. Cualquier cambio de especificaciones o medidas deberá autorizarse por escrito.</p>
          </td>
        </tr>
      </table>
    </div>

    <p class="foot-note">El Cercho · Carpintería de Aluminio y Vidrio · hola@elcercho.mx · +52 55 0000 0000</p>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Toma los datos del "carrito" del paso anterior, los inyecta en la plantilla
 * HTML oculta/autocontenida y abre la vista previa lista para imprimir o
 * guardar como PDF.
 */
export function generarVistaPreviaPDF(data: QuotePdfData): void {
  const html = buildQuotePdfHtml(data);
  const win = window.open("", "_blank", "width=860,height=1100");
  if (!win) {
    window.alert("Permite las ventanas emergentes para visualizar la vista previa del PDF.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  window.setTimeout(() => {
    win.focus();
    win.print();
  }, 400);
}
