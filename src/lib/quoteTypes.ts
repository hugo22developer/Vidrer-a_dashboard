export type ProductCategoryId = "ventana" | "puerta" | "cancel" | "mueble";

export interface ProductSubtype {
  id: string;
  label: string;
}

export interface ProductCategory {
  id: ProductCategoryId;
  label: string;
  description: string;
  icon: "window" | "door" | "panel" | "cabinet";
  subtypes: ProductSubtype[];
  limits: { minW: number; maxW: number; minH: number; maxH: number };
}

export interface LineaAluminio {
  id: string;
  label: string;
  description: string;
  factor: number; // $ por m² (base del perfil)
}

export interface AcabadoAluminio {
  id: string;
  label: string;
  swatch: string; // color o gradiente css
  extra: number; // $ por m²
}

export interface TipoVidrio {
  id: string;
  label: string;
  spec: string;
  factor: number; // $ por m²
}

export interface Herraje {
  id: string;
  label: string;
  price: number; // $ por pieza, monto fijo
}

export type DimensionUnit = "cm" | "m";

/** Partida en configuración (aún no agregada al carrito) */
export interface QuoteDraft {
  categoryId: ProductCategoryId | null;
  subtypeId: string | null;
  subtypeLabel: string | null;
  widthCm: number;
  heightCm: number;
  lineaId: string;
  acabadoId: string;
  vidrioId: string;
  herrajeIds: string[];
  quantity: number;
}

/** Partida ya confirmada dentro del carrito de la cotización */
export interface QuoteItem {
  id: string;
  categoryId: ProductCategoryId;
  categoryLabel: string;
  subtypeLabel: string;
  widthCm: number;
  heightCm: number;
  areaM2: number;
  billableAreaM2: number;
  lineaId: string;
  lineaLabel: string;
  acabadoId: string;
  acabadoLabel: string;
  vidrioId: string;
  vidrioLabel: string;
  herrajeIds: string[];
  herrajeLabels: string[];
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ClientData {
  name: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
}
