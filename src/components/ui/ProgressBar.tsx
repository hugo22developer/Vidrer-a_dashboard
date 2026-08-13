import { motion } from "framer-motion";

interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  suffix?: string;
  colorClass?: string; // clase de color de fondo, p.ej. "bg-accent2"
}

export function ProgressBar({ label, value, suffix, colorClass = "bg-accent2" }: ProgressBarProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between font-body text-sm">
        <span className="text-ink">{label}</span>
        <span className="font-mono text-xs text-ink-muted">{suffix ?? `${value}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
}
