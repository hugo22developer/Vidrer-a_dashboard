import { useState } from "react";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { UserFormModal } from "@/components/forms/UserFormModal";
import { useData } from "@/context/DataContext";
import type { AdminUser, Role } from "@/lib/types";

const ROLE_TONE: Record<Role, string> = {
  "Super Admin": "bg-accent/15 text-accent",
  "Editor de Contenido": "bg-accent2/15 text-accent2",
  Ventas: "bg-ink-muted/15 text-ink-muted",
};

export function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useData();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);

  const columns: Column<AdminUser>[] = [
    {
      header: "Usuario",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} />
          <div>
            <p className="font-medium text-ink">{u.name}</p>
            <p className="font-mono text-xs text-ink-faint">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Rol",
      cell: (u) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] ${ROLE_TONE[u.role]}`}>
          <ShieldCheck size={11} />
          {u.role}
        </span>
      ),
    },
    { header: "Alta", cell: (u) => <span className="font-mono text-xs text-ink-faint">{u.createdAt}</span> },
    { header: "Estado", cell: (u) => <StatusBadge active={u.status === "active"} /> },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Equipo"
        title="Usuarios y Roles"
        description="Administradores, editores de contenido y ventas con acceso al panel."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            <Plus size={16} /> Nuevo usuario
          </button>
        }
      />

      <DataTable
        data={users}
        rowKey={(u) => u.id}
        columns={columns}
        searchPlaceholder="Buscar por nombre o correo..."
        searchFn={(u, q) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)}
        emptyTitle="Sin usuarios"
        emptyDescription="Agrega al primer miembro del equipo con acceso al panel."
        actions={(u) => (
          <>
            <IconButton
              icon={Pencil}
              label="Editar"
              onClick={() => {
                setEditing(u);
                setFormOpen(true);
              }}
            />
            <IconButton icon={Trash2} label="Eliminar" variant="danger" onClick={() => setToDelete(u)} />
          </>
        )}
      />

      <UserFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSave={(u) => (editing ? updateUser(u) : addUser(u))}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && deleteUser(toDelete.id)}
        title="Eliminar usuario"
        description={`Esta acción quitará a "${toDelete?.name}" del panel de administración. Podrás volver a invitarlo más adelante.`}
      />
    </div>
  );
}
