import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { inputClass } from "./FormField";

interface SpecListEditorProps {
  specs: string[];
  onChange: (specs: string[]) => void;
}

/** Editor dinámico de specs técnicas (chips), usado en el formulario de producto. */
export function SpecListEditor({ specs, onChange }: SpecListEditorProps) {
  const [draft, setDraft] = useState("");

  function addSpec() {
    const value = draft.trim();
    if (!value) return;
    onChange([...specs, value]);
    setDraft("");
  }

  function removeSpec(index: number) {
    onChange(specs.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {specs.map((spec, i) => (
            <motion.span
              key={`${spec}-${i}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 py-1 pl-3 pr-1.5 font-mono text-xs text-accent2"
            >
              {spec}
              <button
                type="button"
                onClick={() => removeSpec(i)}
                aria-label={`Quitar ${spec}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-danger/20 hover:text-danger"
              >
                <X size={11} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {specs.length === 0 && (
          <span className="font-body text-xs text-ink-faint">Aún no hay especificaciones agregadas.</span>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSpec();
            }
          }}
          placeholder="Ej. 8mm Templado"
          className={`${inputClass} flex-1`}
        />
        <button
          type="button"
          onClick={addSpec}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3.5 font-body text-sm text-ink transition-colors hover:border-accent2/50 hover:text-accent2"
        >
          <Plus size={15} />
          Agregar
        </button>
      </div>
    </div>
  );
}
