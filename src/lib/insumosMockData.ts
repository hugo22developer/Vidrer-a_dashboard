import type { Insumo } from "./insumoTypes";

export const INITIAL_INSUMOS: Insumo[] = [
  { id: "i1", sku: "ALU-PRF-001", nombre: "Riel superior Serie 3", categoria: "Perfiles de Aluminio", unidad: "m", costoUnitario: 186, factorDesperdicio: 8, notas: "Proveedor: Extrusiones del Norte", ultimaModificacion: "2026-07-28", estado: "active", pendingReview: false },
  { id: "i2", sku: "ALU-PRF-002", nombre: "Jamba Serie 3", categoria: "Perfiles de Aluminio", unidad: "m", costoUnitario: 164, factorDesperdicio: 8, notas: "", ultimaModificacion: "2026-07-28", estado: "active", pendingReview: false },
  { id: "i3", sku: "ALU-PRF-003", nombre: "Zoclo Serie 3", categoria: "Perfiles de Aluminio", unidad: "m", costoUnitario: 142, factorDesperdicio: 6, notas: "", ultimaModificacion: "2026-06-14", estado: "active", pendingReview: false },
  { id: "i4", sku: "ALU-PRF-004", nombre: "Tubular estructural 2x1\"", categoria: "Perfiles de Aluminio", unidad: "m", costoUnitario: 210, factorDesperdicio: 5, notas: "Barandales y portones", ultimaModificacion: "2026-05-02", estado: "active", pendingReview: true },
  { id: "i5", sku: "VID-CRI-001", nombre: "Vidrio Templado 6mm", categoria: "Cristales / Vidrios", unidad: "m²", costoUnitario: 520, factorDesperdicio: 10, notas: "Proveedor: Cristales Cortés", ultimaModificacion: "2026-07-15", estado: "active", pendingReview: false },
  { id: "i6", sku: "VID-CRI-002", nombre: "Vidrio Laminado 9mm", categoria: "Cristales / Vidrios", unidad: "m²", costoUnitario: 780, factorDesperdicio: 10, notas: "", ultimaModificacion: "2026-07-15", estado: "active", pendingReview: false },
  { id: "i7", sku: "VID-CRI-003", nombre: "Duovent / DVH 24mm", categoria: "Cristales / Vidrios", unidad: "m²", costoUnitario: 980, factorDesperdicio: 12, notas: "Tiempo de entrega 3 semanas", ultimaModificacion: "2026-04-20", estado: "active", pendingReview: true },
  { id: "i8", sku: "HER-ACC-001", nombre: "Manija tipo H acero inoxidable", categoria: "Herrajes y Accesorios", unidad: "pza", costoUnitario: 245, factorDesperdicio: 2, notas: "", ultimaModificacion: "2026-06-30", estado: "active", pendingReview: false },
  { id: "i9", sku: "HER-ACC-002", nombre: "Rodaja para corrediza (par)", categoria: "Herrajes y Accesorios", unidad: "pza", costoUnitario: 98, factorDesperdicio: 3, notas: "", ultimaModificacion: "2026-06-30", estado: "active", pendingReview: false },
  { id: "i10", sku: "HER-ACC-003", nombre: "Cierrapuertas hidráulico", categoria: "Herrajes y Accesorios", unidad: "pza", costoUnitario: 610, factorDesperdicio: 0, notas: "", ultimaModificacion: "2026-03-11", estado: "discontinued", pendingReview: false },
  { id: "i11", sku: "CON-SEL-001", nombre: "Silicón estructural (cartucho)", categoria: "Consumibles / Selladores", unidad: "pza", costoUnitario: 145, factorDesperdicio: 15, notas: "", ultimaModificacion: "2026-07-02", estado: "active", pendingReview: false },
  { id: "i12", sku: "CON-SEL-002", nombre: "Cinta de montaje doble cara", categoria: "Consumibles / Selladores", unidad: "m", costoUnitario: 22, factorDesperdicio: 12, notas: "", ultimaModificacion: "2026-07-02", estado: "active", pendingReview: false },
];
