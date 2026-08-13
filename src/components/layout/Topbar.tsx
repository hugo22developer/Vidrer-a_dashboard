import { Menu, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/lib/useTheme";

export function Topbar({ onOpenMobile, title }: { onOpenMobile: () => void; title: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-panel sticky top-0 z-30 flex items-center justify-between gap-4 rounded-none border-x-0 border-t-0 px-5 py-3.5">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMobile} className="text-ink-muted lg:hidden" aria-label="Abrir menú">
          <Menu size={20} />
        </button>
        <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          aria-label="Notificaciones"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2 text-ink-muted transition-colors hover:text-ink"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
    </header>
  );
}
