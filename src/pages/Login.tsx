import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { inputClass } from "@/components/ui/FormField";

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string })?.from ?? "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (!emailValid || !passwordValid) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error ?? "No se pudo iniciar sesión.");
      return;
    }
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4">
      <div className="blueprint-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent2/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-accent/10 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel relative z-10 w-full max-w-sm rounded-3xl p-8"
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <svg width="36" height="36" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="mb-3">
            <rect x="1" y="1" width="24" height="24" rx="5" stroke="var(--color-accent2)" strokeWidth="1.4" />
            <path d="M9 1V25M17 1V25" stroke="var(--color-ink-faint)" strokeWidth="1.2" />
            <path d="M1 13H25" stroke="var(--color-ink-faint)" strokeWidth="1.2" opacity="0.5" />
          </svg>
          <h1 className="font-display text-lg font-semibold text-ink">El Cercho Panel</h1>
          <p className="mt-1 font-body text-sm text-ink-muted">Administración de contenidos y catálogo</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-ink-muted">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@elcercho.mx"
                className={`${inputClass} pl-10 ${touched && !emailValid ? "border-danger" : ""}`}
              />
            </div>
            {touched && !emailValid && (
              <p className="mt-1 flex items-center gap-1 font-body text-xs text-danger">
                <AlertCircle size={12} /> Ingresa un correo válido.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block font-mono text-xs text-ink-muted">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} pl-10 pr-10 ${touched && !passwordValid ? "border-danger" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {touched && !passwordValid && (
              <p className="mt-1 flex items-center gap-1 font-body text-xs text-danger">
                <AlertCircle size={12} /> Mínimo 6 caracteres.
              </p>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl bg-danger/10 px-3.5 py-2.5 font-body text-xs text-danger"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent/80 py-3 font-display text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.02] disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Verificando...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[11px] text-ink-faint">
          Acceso simulado — cualquier correo válido y contraseña de 6+ caracteres funciona.
        </p>
      </motion.div>
    </div>
  );
}
