import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField, inputClass } from "@/components/ui/FormField";
import type { AdminUser, Role, UserStatus } from "@/lib/types";

const ROLES: Role[] = ["Super Admin", "Editor de Contenido", "Ventas"];

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: AdminUser) => void;
  initial?: AdminUser | null;
}

const EMPTY: Omit<AdminUser, "id" | "createdAt"> = { name: "", email: "", role: "Ventas", status: "active" };

export function UserFormModal({ open, onClose, onSave, initial }: UserFormModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { name: initial.name, email: initial.email, role: initial.role, status: initial.status } : EMPTY);
      setErrors({});
    }
  }, [open, initial]);

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "El nombre es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Correo inválido.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: initial?.id ?? `u${Date.now()}`,
      createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
      ...form,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar usuario" : "Nuevo usuario"} description="Administradores y editores con acceso al panel.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nombre completo" htmlFor="u-name" error={errors.name}>
          <input
            id="u-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="Nombre y apellido"
          />
        </FormField>

        <FormField label="Correo electrónico" htmlFor="u-email" error={errors.email}>
          <input
            id="u-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="usuario@elcercho.mx"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Rol" htmlFor="u-role">
            <select
              id="u-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className={`${inputClass} appearance-none`}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Estado" htmlFor="u-status">
            <select
              id="u-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as UserStatus })}
              className={`${inputClass} appearance-none`}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ink-muted transition-colors hover:text-ink">
            Cancelar
          </button>
          <button type="submit" className="rounded-full bg-accent px-5 py-2 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]">
            {initial ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
