import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle({ theme, onToggle }: { theme: "dark" | "light"; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Cambiar tema"
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2 text-ink-muted transition-colors hover:text-ink"
    >
      <motion.div
        key={theme}
        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
      </motion.div>
    </button>
  );
}
