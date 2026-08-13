import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  LayoutGrid,
  PackageSearch,
  Newspaper,
  FileText,
  Boxes,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/usuarios", label: "Usuarios y Roles", icon: Users },
  { to: "/categorias", label: "Categorías", icon: LayoutGrid },
  { to: "/productos", label: "Productos", icon: PackageSearch },
  { to: "/blog", label: "Blog / Noticias", icon: Newspaper },
  { to: "/cotizaciones", label: "Cotizaciones", icon: FileText },
  { to: "/insumos", label: "Insumos", icon: Boxes },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { logout, user } = useAuth();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <LogoMark />
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold tracking-wide text-ink">EL CERCHO</p>
          <p className="font-mono text-[10px] tracking-widest text-ink-faint">PANEL</p>
        </div>
        <button onClick={onCloseMobile} className="ml-auto text-ink-muted lg:hidden" aria-label="Cerrar menú">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-body text-sm transition-colors ${
                isActive ? "bg-accent2/10 text-accent2" : "text-ink-muted hover:bg-surface-2 hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent2"
                  />
                )}
                <item.icon size={17} strokeWidth={1.75} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 font-display text-xs font-semibold text-accent">
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-body text-xs font-medium capitalize text-ink">{user?.name ?? "Admin"}</p>
            <p className="truncate font-mono text-[10px] text-ink-faint">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-body text-sm text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="glass-panel sticky top-0 hidden h-screen w-64 shrink-0 rounded-none border-y-0 border-l-0 lg:block">
        {content}
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-canvas/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="glass-panel fixed inset-y-0 left-0 z-50 w-72 rounded-none border-y-0 border-l-0 lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="24" height="24" rx="4" stroke="var(--color-accent2)" strokeWidth="1.4" />
      <path d="M9 1V25M17 1V25" stroke="var(--color-ink-faint)" strokeWidth="1.2" />
      <path d="M1 13H25" stroke="var(--color-ink-faint)" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}
