import type {
  ProductCategory,
  LineaAluminio,
  AcabadoAluminio,
  TipoVidrio,
  Herraje,
  QuoteDraft,
} from "./quoteTypes";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "ventana",
    label: "Ventana",
    description: "Corrediza, abatible o proyectante",
    icon: "window",
    subtypes: [
      { id: "ventana-corrediza", label: "Corrediza" },
      { id: "ventana-abatible", label: "Abatible" },
      { id: "ventana-proyectante", label: "Proyectante" },
    ],
    limits: { minW: 40, maxW: 250, minH: 40, maxH: 220 },
  },
  {
    id: "puerta",
    label: "Puerta",
    description: "Corrediza o abatible",
    icon: "door",
    subtypes: [
      { id: "puerta-corrediza", label: "Corrediza" },
      { id: "puerta-abatible", label: "Abatible" },
    ],
    limits: { minW: 60, maxW: 180, minH: 180, maxH: 250 },
  },
  {
    id: "cancel",
    label: "Cancel de Baño / Mampara",
    description: "Corredizo o fijo panorámico",
    icon: "panel",
    subtypes: [
      { id: "cancel-corredizo", label: "Corredizo" },
      { id: "cancel-fijo", label: "Fijo / Mampara" },
    ],
    limits: { minW: 60, maxW: 200, minH: 180, maxH: 210 },
  },
  {
    id: "mueble",
    label: "Mueble / Vitrina de Aluminio",
    description: "Vitrina, clóset o división",
    icon: "cabinet",
    subtypes: [
      { id: "mueble-vitrina", label: "Vitrina" },
      { id: "mueble-closet", label: "Clóset / División" },
    ],
    limits: { minW: 40, maxW: 300, minH: 40, maxH: 240 },
  },
];

export const LINEAS_ALUMINIO: LineaAluminio[] = [
  {
    id: "tradicional",
    label: "Línea Tradicional / Económica",
    description: "Perfil estándar, ideal para proyectos residenciales con presupuesto ajustado.",
    factor: 950,
  },
  {
    id: "europea",
    label: "Línea Europea / Pesada",
    description: "Perfil reforzado de mayor calibre, mejor sellado y vida útil en uso intensivo.",
    factor: 1550,
  },
  {
    id: "ruptura-termica",
    label: "Sistema con Ruptura Térmica",
    description: "Barrera de poliamida que corta el puente térmico — máximo aislamiento.",
    factor: 2250,
  },
];

export const ACABADOS_ALUMINIO: AcabadoAluminio[] = [
  { id: "anodizado", label: "Anodizado Natural", swatch: "#b9bec5", extra: 0 },
  { id: "blanco", label: "Blanco", swatch: "#f4f5f7", extra: 60 },
  { id: "negro-mate", label: "Negro Mate", swatch: "#26282b", extra: 90 },
  { id: "madera", label: "Tipo Madera", swatch: "linear-gradient(135deg,#8a5a34,#5e3b20)", extra: 150 },
];

export const TIPOS_VIDRIO: TipoVidrio[] = [
  { id: "crudo", label: "Vidrio Crudo Monolítico", spec: "4-5mm, económico, sin tratamiento térmico", factor: 210 },
  { id: "templado-6", label: "Templado 6mm", spec: "Resistente a impacto, cumple NOM de seguridad", factor: 360 },
  { id: "templado-9", label: "Templado 9mm", spec: "Mayor grosor, usado en vanos amplios", factor: 520 },
  { id: "templado-10", label: "Templado 10mm", spec: "Para fachadas y paños de gran formato", factor: 590 },
  { id: "laminado", label: "Vidrio Laminado", spec: "Dos capas + PVB, seguridad ante rotura", factor: 680 },
  { id: "dvh", label: "Duovent / DVH", spec: "Doble vidriado hermético, máximo aislamiento", factor: 860 },
];

export const HERRAJES: Herraje[] = [
  { id: "cerradura", label: "Cerradura de seguridad", price: 480 },
  { id: "jaladera-h", label: "Jaladera tipo H acero inoxidable", price: 390 },
  { id: "cierrapuertas", label: "Cierrapuertas hidráulico", price: 920 },
];

/** Área mínima facturable, práctica común del sector para vanos pequeños. */
export const MIN_BILLABLE_AREA_M2 = 0.36;
export const DEFAULT_IVA_PERCENT = 16;

export const EMPTY_DRAFT: QuoteDraft = {
  categoryId: null,
  subtypeId: null,
  subtypeLabel: null,
  widthCm: 100,
  heightCm: 120,
  lineaId: LINEAS_ALUMINIO[0].id,
  acabadoId: ACABADOS_ALUMINIO[0].id,
  vidrioId: TIPOS_VIDRIO[0].id,
  herrajeIds: [],
  quantity: 1,
};

export function getById<T extends { id: string }>(list: T[], id: string): T {
  const found = list.find((item) => item.id === id);
  if (!found) throw new Error(`No se encontró el id "${id}" en la lista de configuración.`);
  return found;
}

/**
 * Fórmula de precio: área en m² (con mínimo facturable) × (factor de línea de
 * aluminio + factor de tipo de vidrio + extra de acabado) + suma de herrajes.
 */
export function calcUnitPrice(params: {
  widthCm: number;
  heightCm: number;
  lineaId: string;
  acabadoId: string;
  vidrioId: string;
  herrajeIds: string[];
}) {
  const areaM2 = (params.widthCm / 100) * (params.heightCm / 100);
  const billableAreaM2 = Math.max(areaM2, MIN_BILLABLE_AREA_M2);

  const linea = getById(LINEAS_ALUMINIO, params.lineaId);
  const acabado = getById(ACABADOS_ALUMINIO, params.acabadoId);
  const vidrio = getById(TIPOS_VIDRIO, params.vidrioId);

  const base = billableAreaM2 * (linea.factor + vidrio.factor + acabado.extra);
  const herrajesTotal = params.herrajeIds.reduce((sum, id) => sum + getById(HERRAJES, id).price, 0);

  return { areaM2, billableAreaM2, unitPrice: Math.round(base + herrajesTotal) };
}

export function formatMXN(value: number) {
  return value.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
}
