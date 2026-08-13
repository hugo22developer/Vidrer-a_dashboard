import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent2">{eyebrow}</span>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl font-body text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
