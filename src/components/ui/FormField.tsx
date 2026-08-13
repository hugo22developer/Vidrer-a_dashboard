import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

export function FormField({ label, htmlFor, children, error, className = "" }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block font-mono text-xs text-ink-muted">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 font-body text-xs text-danger">{error}</p>}
    </div>
  );
}

/** Clase compartida para inputs/selects/textareas del panel — mismo lenguaje visual en todos los forms. */
export const inputClass =
  "w-full rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent2";
