import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-ink-faint">
        <Icon size={20} strokeWidth={1.5} />
      </span>
      <p className="mt-4 font-display text-base font-semibold text-ink">{title}</p>
      <p className="mt-1.5 max-w-sm font-body text-sm text-ink-muted">{description}</p>
    </div>
  );
}
