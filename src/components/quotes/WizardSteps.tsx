import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Producto" },
  { n: 2, label: "Configuración" },
  { n: 3, label: "Resumen" },
  { n: 4, label: "Cotización" },
];

export function WizardSteps({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2 sm:gap-4">
      {STEPS.map((s, i) => {
        const state = s.n < current ? "done" : s.n === current ? "active" : "pending";
        return (
          <li key={s.n} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-colors ${
                  state === "active"
                    ? "bg-accent text-accent-ink"
                    : state === "done"
                    ? "bg-accent2/15 text-accent2"
                    : "bg-surface-2 text-ink-faint"
                }`}
              >
                {state === "done" ? <Check size={14} /> : s.n}
                {state === "active" && (
                  <motion.span
                    layoutId="wizard-ring"
                    className="absolute -inset-1 rounded-full border border-accent/40"
                  />
                )}
              </div>
              <span className={`hidden font-body text-sm sm:inline ${state === "pending" ? "text-ink-faint" : "text-ink"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-px flex-1 ${state === "done" ? "bg-accent2/40" : "bg-line"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
