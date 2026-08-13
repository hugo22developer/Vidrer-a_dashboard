import type { AdminUser, Category, Product, BlogPost, WeeklyActivityPoint } from "./types";

export const INITIAL_USERS: AdminUser[] = [
  { id: "u1", name: "Hugo Martínez", email: "hugo@elcercho.mx", role: "Super Admin", status: "active", createdAt: "2024-02-10" },
  { id: "u2", name: "Renata Solís", email: "renata@elcercho.mx", role: "Editor de Contenido", status: "active", createdAt: "2024-06-03" },
  { id: "u3", name: "Iván Cortez", email: "ivan@elcercho.mx", role: "Ventas", status: "active", createdAt: "2024-09-21" },
  { id: "u4", name: "Paola Nuño", email: "paola@elcercho.mx", role: "Ventas", status: "inactive", createdAt: "2023-11-14" },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    slug: "canceles-de-bano",
    label: "Canceles de Baño",
    shortLabel: "Canceles de baño",
    eyebrow: "Línea Canceles",
    heroDescription: "Vidrio templado de 8mm y herrajes minimalistas: cero filtraciones, cero ruido en los rieles.",
    heroSpecs: ["Vidrio 8mm Templado", "Herrajes ocultos", "Instalación en 1 día"],
    accent: "from-accent2/25 via-surface to-canvas",
  },
  {
    slug: "ventanas-puertas",
    label: "Ventanas y Puertas",
    shortLabel: "Ventanas y puertas",
    eyebrow: "Línea Ventanería",
    heroDescription: "Sistemas Serie 3 con cámara de aire DVH: el balance entre entrada de luz y control térmico real.",
    heroSpecs: ["Perfil Serie 3", "DVH 24mm", "Doble sello EPDM"],
    accent: "from-accent/20 via-surface to-canvas",
  },
  {
    slug: "barandales-portones",
    label: "Barandales y Portones",
    shortLabel: "Barandales y portones",
    eyebrow: "Línea Exteriores",
    heroDescription: "Estructura de aluminio y vidrio pensada para exteriores: resistencia a intemperie sin perder la línea minimalista.",
    heroSpecs: ["Aluminio Reforzado", "Vidrio 10mm", "Anticorrosivo"],
    accent: "from-ink-muted/20 via-surface to-canvas",
  },
  {
    slug: "muebles-a-medida",
    label: "Muebles a Medida",
    shortLabel: "Muebles a medida",
    eyebrow: "Línea Interiores",
    heroDescription: "Aluminio anodizado y cristal para mobiliario interior: la misma precisión de taller aplicada a piezas de uso diario.",
    heroSpecs: ["Aluminio + Cristal", "Acabado anodizado", "Diseño a medida"],
    accent: "from-accent2/20 via-surface to-canvas",
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", slug: "corredizo-minimalista", categorySlug: "canceles-de-bano", title: "Cancel Corredizo Minimalista", description: "Dos hojas sobre riel superior de aluminio anodizado, sin marco inferior visible.", image: "/products/canceles-de-bano/corredizo-minimalista.jpg", specs: ["8mm Templado", "Riel superior", "Anodizado mate"], status: "active", consultations: 214 },
  { id: "p2", slug: "abatible-frameless", categorySlug: "canceles-de-bano", title: "Cancel Abatible Frameless", description: "Una sola hoja sin marco perimetral, sostenida por bisagras de piso a techo.", image: "/products/canceles-de-bano/abatible-frameless.jpg", specs: ["10mm Templado", "Bisagra piso-techo"], status: "active", consultations: 98 },
  { id: "p3", slug: "fijo-panoramico", categorySlug: "canceles-de-bano", title: "Cancel Fijo Panorámico", description: "Panel fijo de gran formato para regaderas abiertas, con sello inferior antiderrame.", image: "/products/canceles-de-bano/fijo-panoramico.jpg", specs: ["8mm Templado", "Sello antiderrame"], status: "draft", consultations: 41 },
  { id: "p4", slug: "ventana-corrediza-serie-3", categorySlug: "ventanas-puertas", title: "Ventana Corrediza Serie 3", description: "Dos o tres hojas sobre riel de rodamiento silencioso, con cámara DVH.", image: "/products/ventanas-puertas/ventana-corrediza.jpg", specs: ["Serie 3", "DVH 24mm", "2-3 hojas"], status: "active", consultations: 356 },
  { id: "p5", slug: "puerta-corrediza-panoramica", categorySlug: "ventanas-puertas", title: "Puerta Corrediza Panorámica", description: "Vanos de gran formato para conectar interior y jardín, riel embebido a piso.", image: "/products/ventanas-puertas/puerta-corrediza.jpg", specs: ["Serie 4", "Riel embebido"], status: "active", consultations: 187 },
  { id: "p6", slug: "barandal-vidrio-templado", categorySlug: "barandales-portones", title: "Barandal de Vidrio Templado", description: "Paneles de vidrio templado de 10mm con fijación puntual de acero inoxidable.", image: "/products/barandales-portones/barandal-vidrio.jpg", specs: ["10mm Templado", "Fijación puntual", "Inox 304"], status: "active", consultations: 132 },
  { id: "p7", slug: "porton-corredizo-automatizado", categorySlug: "barandales-portones", title: "Portón Corredizo Automatizado", description: "Estructura de aluminio reforzado sobre riel de piso, compatible con motor.", image: "/products/barandales-portones/porton-corredizo.jpg", specs: ["Aluminio reforzado", "Listo para motor"], status: "active", consultations: 76 },
  { id: "p8", slug: "closet-puertas-cristal", categorySlug: "muebles-a-medida", title: "Clóset con Puertas de Cristal", description: "Sistema corredizo o abatible con puertas de cristal esmerilado o transparente.", image: "/products/muebles-a-medida/closet-cristal.jpg", specs: ["Cristal esmerilado", "Marco delgado"], status: "draft", consultations: 29 },
];

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: "b1", slug: "fachadas-muro-cortina", category: "Tendencias",
    title: "Fachadas de muro cortina: la nueva piel de la arquitectura comercial",
    excerpt: "Por qué cada vez más despachos eligen envolventes de vidrio estructural sobre mampostería tradicional.",
    content: "Contenido completo del artículo sobre fachadas de muro cortina...",
    accent: "from-accent2/30 to-surface", status: "published", date: "2026-06-02", views: 1840,
  },
  {
    id: "b2", slug: "mantenimiento-canceles-bano", category: "Mantenimiento",
    title: "Cómo alargar la vida útil de tus canceles de baño",
    excerpt: "Limpieza, lubricación de rieles y señales tempranas de desgaste en herrajes y sellos.",
    content: "Contenido completo del artículo sobre mantenimiento de canceles...",
    accent: "from-accent/25 to-surface", status: "published", date: "2026-05-18", views: 2960,
  },
  {
    id: "b3", slug: "dvh-vs-vidrio-simple", category: "Guía técnica",
    title: "DVH vs. vidrio simple: qué gana realmente tu factura eléctrica",
    excerpt: "Comparativa real de aislamiento térmico entre sistemas de doble y triple acristalamiento.",
    content: "Contenido completo del artículo sobre DVH vs vidrio simple...",
    accent: "from-ink-muted/25 to-surface", status: "draft", date: "2026-07-10", views: 410,
  },
];

export const WEEKLY_ACTIVITY: WeeklyActivityPoint[] = [
  { label: "Lun", quotes: 6 },
  { label: "Mar", quotes: 9 },
  { label: "Mié", quotes: 4 },
  { label: "Jue", quotes: 11 },
  { label: "Vie", quotes: 14 },
  { label: "Sáb", quotes: 7 },
  { label: "Dom", quotes: 3 },
];

export const MOCK_TOTAL_QUOTES = 312;
