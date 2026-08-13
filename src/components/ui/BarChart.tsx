import { motion } from "framer-motion";

interface BarChartProps {
  data: { label: string; value: number }[];
}

/** Mini gráfica de barras hecha a mano — coherente con la estética de plano técnico de la marca. */
export function BarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end overflow-hidden rounded-lg bg-surface-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
              className="w-full rounded-lg bg-gradient-to-t from-accent2/70 to-accent2"
            />
          </div>
          <span className="font-mono text-[11px] text-ink-faint">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
