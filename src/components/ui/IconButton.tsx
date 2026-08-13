import type { LucideIcon } from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

export function IconButton({ icon: Icon, label, onClick, variant = "default" }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors ${
        variant === "danger" ? "hover:border-danger/50 hover:bg-danger/10 hover:text-danger" : "hover:border-accent2/50 hover:bg-accent2/10 hover:text-accent2"
      }`}
    >
      <Icon size={14} />
    </button>
  );
}
