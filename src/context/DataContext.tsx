import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import type { AdminUser, Category, Product, BlogPost } from "@/lib/types";
import type { Insumo, InsumoCategoria } from "@/lib/insumoTypes";
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_POSTS } from "@/lib/mockData";
import { INITIAL_INSUMOS } from "@/lib/insumosMockData";
import { apiFetch } from "@/lib/api";

interface DataState {
  users: AdminUser[];
  categories: Category[];
  products: Product[];
  posts: BlogPost[];
  insumos: Insumo[];
}

type Action =
  | { type: "SET_ALL"; payload: DataState }
  | { type: "ADD_USER"; payload: AdminUser }
  | { type: "UPDATE_USER"; payload: AdminUser }
  | { type: "DELETE_USER"; payload: string }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "ADD_POST"; payload: BlogPost }
  | { type: "UPDATE_POST"; payload: BlogPost }
  | { type: "DELETE_POST"; payload: string }
  | { type: "ADD_INSUMO"; payload: Insumo }
  | { type: "UPDATE_INSUMO"; payload: Insumo }
  | { type: "DELETE_INSUMO"; payload: string }
  | { type: "BULK_UPDATE_INSUMO_PRICES"; payload: { scope: InsumoCategoria | "all"; percent: number } };

function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case "SET_ALL":
      return action.payload;
    case "ADD_USER":
      return { ...state, users: [action.payload, ...state.users] };
    case "UPDATE_USER":
      return { ...state, users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)) };
    case "DELETE_USER":
      return { ...state, users: state.users.filter((u) => u.id !== action.payload) };

    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) => (c.slug === action.payload.slug ? action.payload : c)),
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((c) => c.slug !== action.payload),
        products: state.products.filter((p) => p.categorySlug !== action.payload),
      };

    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE_PRODUCT":
      return { ...state, products: state.products.map((p) => (p.id === action.payload.id ? action.payload : p)) };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };

    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "UPDATE_POST":
      return { ...state, posts: state.posts.map((p) => (p.id === action.payload.id ? action.payload : p)) };
    case "DELETE_POST":
      return { ...state, posts: state.posts.filter((p) => p.id !== action.payload) };

    case "ADD_INSUMO":
      return { ...state, insumos: [action.payload, ...state.insumos] };
    case "UPDATE_INSUMO":
      return { ...state, insumos: state.insumos.map((i) => (i.id === action.payload.id ? action.payload : i)) };
    case "DELETE_INSUMO":
      return { ...state, insumos: state.insumos.filter((i) => i.id !== action.payload) };
    case "BULK_UPDATE_INSUMO_PRICES": {
      const { scope, percent } = action.payload;
      const today = new Date().toISOString().slice(0, 10);
      return {
        ...state,
        insumos: state.insumos.map((i) =>
          scope === "all" || i.categoria === scope
            ? { ...i, costoUnitario: Math.round(i.costoUnitario * (1 + percent / 100) * 100) / 100, ultimaModificacion: today }
            : i
        ),
      };
    }

    default:
      return state;
  }
}

interface DataContextValue extends DataState {
  addUser: (u: AdminUser) => void;
  updateUser: (u: AdminUser) => void;
  deleteUser: (id: string) => void;
  addCategory: (c: Category) => void;
  updateCategory: (c: Category) => void;
  deleteCategory: (slug: string) => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addPost: (p: BlogPost) => void;
  updatePost: (p: BlogPost) => void;
  deletePost: (id: string) => void;
  addInsumo: (i: Insumo) => void;
  updateInsumo: (i: Insumo) => void;
  deleteInsumo: (id: string) => void;
  bulkUpdateInsumoPrices: (scope: InsumoCategoria | "all", percent: number) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    users: INITIAL_USERS,
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    posts: INITIAL_POSTS,
    insumos: INITIAL_INSUMOS,
  });

  async function loadAll() {
    try {
      const [users, categories, products, posts, insumos] = await Promise.all([
        apiFetch<AdminUser[]>("/users"),
        apiFetch<Category[]>("/categories"),
        apiFetch<Product[]>("/products"),
        apiFetch<BlogPost[]>("/blog"),
        apiFetch<Insumo[]>("/insumos"),
      ]);
      dispatch({ type: "SET_ALL", payload: { users, categories, products, posts, insumos } });
    } catch {
      // El fallback mock mantiene el panel usable si la API local aún no está levantada.
    }
  }

  useEffect(() => {
    loadAll();
    window.addEventListener("elcercho-auth-changed", loadAll);
    return () => window.removeEventListener("elcercho-auth-changed", loadAll);
  }, []);

  const value: DataContextValue = {
    ...state,
    addUser: async (u) => {
      const created = await apiFetch<AdminUser>("/users", { method: "POST", body: JSON.stringify({ ...u, password: "Admin123!" }) });
      dispatch({ type: "ADD_USER", payload: created });
    },
    updateUser: async (u) => {
      const updated = await apiFetch<AdminUser>(`/users/${u.id}`, { method: "PATCH", body: JSON.stringify(u) });
      dispatch({ type: "UPDATE_USER", payload: updated });
    },
    deleteUser: async (id) => {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      dispatch({ type: "DELETE_USER", payload: id });
    },
    addCategory: async (c) => {
      const created = await apiFetch<Category>("/categories", { method: "POST", body: JSON.stringify(c) });
      dispatch({ type: "ADD_CATEGORY", payload: created });
    },
    updateCategory: async (c) => {
      const updated = await apiFetch<Category>(`/categories/${c.slug}`, { method: "PATCH", body: JSON.stringify(c) });
      dispatch({ type: "UPDATE_CATEGORY", payload: updated });
    },
    deleteCategory: async (slug) => {
      await apiFetch(`/categories/${slug}`, { method: "DELETE" });
      dispatch({ type: "DELETE_CATEGORY", payload: slug });
    },
    addProduct: async (p) => {
      const created = await apiFetch<Product>("/products", { method: "POST", body: JSON.stringify(p) });
      dispatch({ type: "ADD_PRODUCT", payload: created });
    },
    updateProduct: async (p) => {
      const updated = await apiFetch<Product>(`/products/${p.id}`, { method: "PATCH", body: JSON.stringify(p) });
      dispatch({ type: "UPDATE_PRODUCT", payload: updated });
    },
    deleteProduct: async (id) => {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      dispatch({ type: "DELETE_PRODUCT", payload: id });
    },
    addPost: async (p) => {
      const created = await apiFetch<BlogPost>("/blog", { method: "POST", body: JSON.stringify(p) });
      dispatch({ type: "ADD_POST", payload: created });
    },
    updatePost: async (p) => {
      const updated = await apiFetch<BlogPost>(`/blog/${p.id}`, { method: "PATCH", body: JSON.stringify(p) });
      dispatch({ type: "UPDATE_POST", payload: updated });
    },
    deletePost: async (id) => {
      await apiFetch(`/blog/${id}`, { method: "DELETE" });
      dispatch({ type: "DELETE_POST", payload: id });
    },
    addInsumo: async (i) => {
      const created = await apiFetch<Insumo>("/insumos", { method: "POST", body: JSON.stringify(i) });
      dispatch({ type: "ADD_INSUMO", payload: created });
    },
    updateInsumo: async (i) => {
      const updated = await apiFetch<Insumo>(`/insumos/${i.id}`, { method: "PATCH", body: JSON.stringify(i) });
      dispatch({ type: "UPDATE_INSUMO", payload: updated });
    },
    deleteInsumo: async (id) => {
      await apiFetch(`/insumos/${id}`, { method: "DELETE" });
      dispatch({ type: "DELETE_INSUMO", payload: id });
    },
    bulkUpdateInsumoPrices: async (scope, percent) => {
      const updated = await apiFetch<Insumo[]>("/insumos/bulk-update", { method: "POST", body: JSON.stringify({ scope, percent }) });
      dispatch({ type: "SET_ALL", payload: { ...state, insumos: updated } });
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}
