import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch, setAccessToken } from "@/lib/api";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const REFRESH_KEY = "elcercho_panel_refresh";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) return;
    apiFetch<{ accessToken: string; refreshToken: string; user: AuthUser }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
      .then((data) => {
        setAccessToken(data.accessToken);
        localStorage.setItem(REFRESH_KEY, data.refreshToken);
        setUser(data.user);
        window.dispatchEvent(new Event("elcercho-auth-changed"));
      })
      .catch(() => {
        localStorage.removeItem(REFRESH_KEY);
        setAccessToken(null);
      });
  }, []);

  async function login(email: string, password: string) {
    try {
      const data = await apiFetch<{ accessToken: string; refreshToken: string; user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAccessToken(data.accessToken);
      localStorage.setItem(REFRESH_KEY, data.refreshToken);
      setUser(data.user);
      window.dispatchEvent(new Event("elcercho-auth-changed"));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "No se pudo iniciar sesión." };
    }
  }

  function logout() {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (refreshToken) {
      apiFetch("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }).catch(() => undefined);
    }
    localStorage.removeItem(REFRESH_KEY);
    setAccessToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
