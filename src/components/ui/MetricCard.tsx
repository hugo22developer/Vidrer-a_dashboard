import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: { value: string; direction: "up" | "down" };
  sublabel?: string;
  index?: number;
}

export function MetricCard({ icon: Icon, label, value, trend, sublabel, index = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="glass-panel rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent2/10 text-accent2">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        {trend && (
          <span
            className={`flex items-center gap-0.5 font-mono text-[11px] ${
              trend.direction === "up" ? "text-success" : "text-danger"
            }`}
          >
            {trend.direction === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 font-body text-sm text-ink-muted">{label}</p>
      {sublabel && <p className="mt-0.5 font-mono text-[11px] text-ink-faint">{sublabel}</p>}
    </motion.div>
  );
}
