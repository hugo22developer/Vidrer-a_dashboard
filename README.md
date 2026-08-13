# El Cercho Panel — Administración de Landing

Panel de control administrativo en React + TypeScript + Tailwind CSS v4 +
Framer Motion + Lucide React. Misma identidad visual de la landing
(grafito / vidrio / ámbar), con soporte real de **modo claro/oscuro** vía
tokens semánticos.

## 1. Instalar dependencias

```bash
npm install react-router-dom framer-motion lucide-react
```

Tailwind v4 (si el proyecto aún no lo tiene inicializado):

```bash
npm install tailwindcss @tailwindcss/vite
```

> No se usan componentes de shadcn/ui generados por CLI: la tabla, el
> modal, los selects y los inputs se construyeron a mano con clases
> utilitarias (`DataTable`, `Modal`, `FormField`) para no depender de
> `npx shadcn add` en la entrega. Si prefieres los componentes reales de
> shadcn (`Dialog`, `Table`, `Select`), son reemplazos directos de
> `Modal.tsx` y `DataTable.tsx` respectivamente — el resto del panel no
> cambia.

## 2. Alias `@/` y Vite

`vite.config.ts`:

```ts
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

`tsconfig.json` (dentro de `compilerOptions`):

```json
{
  "baseUrl": ".",
  "paths": { "@/*": ["./src/*"] }
}
```

## 3. Cómo entrar

En `/login`, cualquier correo con formato válido (`algo@dominio.com`) y una
contraseña de 6+ caracteres inicia sesión — es autenticación **simulada**,
persistida en `localStorage`. Sustituye `AuthContext.tsx` → `login()` por tu
llamada real al backend cuando exista.

## 4. Arquitectura de datos

Todo el CRUD (usuarios, categorías, productos, blog) vive en un solo
`DataContext.tsx` con `useReducer` — una sola fuente de verdad en memoria,
por eso el Dashboard puede calcular "categoría más vista" o "producto
estrella" en tiempo real a partir de los mismos datos que editas en las
otras secciones. Al recargar la página, los datos vuelven a los mocks de
`lib/mockData.ts` (no hay persistencia real todavía).

Para conectar un backend real: reemplaza las funciones `add*/update*/delete*`
de `DataContext.tsx` por llamadas a tu API, y carga el estado inicial con
`useEffect` + `fetch` en vez de `INITIAL_*` de `mockData.ts`. Los
componentes de página (`UsersPage`, `ProductsPage`, etc.) no necesitan
cambios porque solo consumen `useData()`.

## 5. Estructura de archivos

```
src/
├── App.tsx                          # providers + rutas
├── main.tsx
├── index.css                        # tokens semánticos (claro/oscuro)
├── lib/
│   ├── types.ts
│   ├── mockData.ts                  # semillas de usuarios/categorías/productos/blog
│   └── useTheme.ts                  # toggle claro/oscuro persistente
├── context/
│   ├── AuthContext.tsx              # login simulado + sesión persistida
│   └── DataContext.tsx              # useReducer con todo el CRUD
├── components/
│   ├── auth/ProtectedRoute.tsx
│   ├── layout/
│   │   ├── AdminLayout.tsx          # sidebar + topbar + transición de página
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── forms/                       # un modal de formulario por entidad
│   │   ├── UserFormModal.tsx
│   │   ├── CategoryFormModal.tsx
│   │   ├── ProductFormModal.tsx
│   │   └── BlogFormModal.tsx
│   └── ui/                          # primitivas reutilizables
│       ├── DataTable.tsx            # tabla genérica con búsqueda + acciones
│       ├── Modal.tsx / ConfirmDialog.tsx
│       ├── SpecListEditor.tsx       # chips dinámicos de specs técnicas
│       ├── MetricCard.tsx / ProgressBar.tsx / BarChart.tsx
│       ├── StatusBadge.tsx / Avatar.tsx / IconButton.tsx
│       └── FormField.tsx / PageHeader.tsx / EmptyState.tsx
└── pages/
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── UsersPage.tsx
    ├── CategoriesPage.tsx
    ├── ProductsPage.tsx
    ├── BlogPage.tsx
    └── QuotesPage.tsx               # placeholder, listo para el cotizador avanzado
```

## 6. Pendientes antes de producción

- Conectar `AuthContext.tsx` a autenticación real (JWT/sesión de servidor).
- Conectar `DataContext.tsx` a tu API/base de datos.
- `ProductFormModal.tsx`: si vas a subir imágenes reales en vez de rutas de
  texto, cambia el input de URL por un `<input type="file">` con tu
  servicio de almacenamiento (S3, Cloudinary, etc.).
- `QuotesPage.tsx`: contenedor listo para recibir la tabla real de
  solicitudes del formulario de la landing.
- Ambos proyectos (landing y panel) comparten la misma dirección de marca
  pero **no comparten código** todavía — si más adelante quieres una sola
  fuente de verdad para categorías/productos entre la landing pública y
  este panel, lo natural es exponer esos datos vía API y que ambos los
  consuman desde ahí.
