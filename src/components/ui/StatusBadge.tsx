interface StatusBadgeProps {
  active: boolean;
  labels?: [string, string]; // [activo, inactivo]
}

export function StatusBadge({ active, labels = ["Activo", "Inactivo"] }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wide ${
        active ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-success" : "bg-danger"}`} />
      {active ? labels[0] : labels[1]}
    </span>
  );
}
