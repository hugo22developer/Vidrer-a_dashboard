import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Eliminar",
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex items-start gap-3 rounded-xl bg-danger/10 p-3.5">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-danger" />
        <p className="font-body text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-full border border-line px-4 py-2 font-body text-sm text-ink-muted transition-colors hover:text-ink"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="rounded-full bg-danger px-4 py-2 font-display text-sm font-semibold text-danger-ink transition-transform hover:scale-[1.03]"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
