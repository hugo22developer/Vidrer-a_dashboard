import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { FormField, inputClass } from "@/components/ui/FormField";
import type { ClientData } from "@/lib/quoteTypes";

interface Step4ClientProps {
  client: ClientData;
  onChange: (patch: Partial<ClientData>) => void;
  onBack: () => void;
  onGenerate: () => void;
}

export function Step4Client({ client, onChange, onBack, onGenerate }: Step4ClientProps) {
  const valid = client.name.trim() && client.phone.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-panel mx-auto max-w-xl rounded-2xl p-6">
      <h3 className="font-display text-base font-semibold text-ink">Datos del cliente</h3>
      <p className="mt-1 font-body text-sm text-ink-muted">Se incluirán en el encabezado de la cotización formal.</p>

      <div className="mt-5 space-y-4">
        <FormField label="Nombre completo" htmlFor="c-name">
          <input id="c-name" value={client.name} onChange={(e) => onChange({ name: e.target.value })} className={inputClass} placeholder="Nombre del cliente" />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Teléfono" htmlFor="c-phone">
            <input id="c-phone" value={client.phone} onChange={(e) => onChange({ phone: e.target.value })} className={inputClass} placeholder="55 0000 0000" />
          </FormField>
          <FormField label="Correo" htmlFor="c-email">
            <input id="c-email" type="email" value={client.email} onChange={(e) => onChange({ email: e.target.value })} className={inputClass} placeholder="cliente@correo.com" />
          </FormField>
        </div>

        <FormField label="Dirección de obra" htmlFor="c-address">
          <input id="c-address" value={client.address} onChange={(e) => onChange({ address: e.target.value })} className={inputClass} placeholder="Calle, número, colonia" />
        </FormField>

        <FormField label="Código Postal" htmlFor="c-cp">
          <input id="c-cp" value={client.postalCode} onChange={(e) => onChange({ postalCode: e.target.value })} className={`${inputClass} max-w-[160px]`} placeholder="00000" />
        </FormField>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 font-body text-sm text-ink-muted transition-colors hover:text-ink">
          <ArrowLeft size={15} /> Volver al resumen
        </button>
        <button
          onClick={onGenerate}
          disabled={!valid}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
        >
          <FileText size={16} /> Generar cotización
        </button>
      </div>
    </motion.div>
  );
}
