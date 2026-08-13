import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const TITLES: Record<string, string> = {
  "/dashboard": "Resumen general",
  "/usuarios": "Usuarios y Roles",
  "/categorias": "Categorías del Catálogo",
  "/productos": "Productos por Categoría",
  "/blog": "Blog / Noticias",
  "/cotizaciones": "Gestión de Cotizaciones",
  "/insumos": "Insumos y Materia Prima",
};

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] ?? "Panel";

  return (
    <div className="min-h-screen bg-canvas font-body text-ink">
      <div className="flex">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <div className="min-w-0 flex-1">
          <Topbar onOpenMobile={() => setMobileOpen(true)} title={title} />
          <main className="p-5 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
