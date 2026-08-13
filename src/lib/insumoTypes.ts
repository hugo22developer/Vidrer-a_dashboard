export type InsumoCategoria =
  | "Perfiles de Aluminio"
  | "Cristales / Vidrios"
  | "Herrajes y Accesorios"
  | "Consumibles / Selladores";

export type UnidadMedida = "m" | "m²" | "pza" | "kg";
export type InsumoEstado = "active" | "discontinued";

export interface Insumo {
  id: string;
  sku: string;
  nombre: string;
  categoria: InsumoCategoria;
  unidad: UnidadMedida;
  costoUnitario: number;
  factorDesperdicio: number; // %
  notas: string;
  ultimaModificacion: string; // ISO date
  estado: InsumoEstado;
  /** Proveedor notificó un cambio de precio aún no confirmado/aplicado. */
  pendingReview: boolean;
}

export const INSUMO_CATEGORIAS: InsumoCategoria[] = [
  "Perfiles de Aluminio",
  "Cristales / Vidrios",
  "Herrajes y Accesorios",
  "Consumibles / Selladores",
];

export const UNIDADES_MEDIDA: UnidadMedida[] = ["m", "m²", "pza", "kg"];
