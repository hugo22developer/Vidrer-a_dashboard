export type Role = "Super Admin" | "Editor de Contenido" | "Ventas";
export type UserStatus = "active" | "inactive";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string; // ISO date
}

export interface Category {
  slug: string;
  label: string;
  shortLabel: string;
  eyebrow: string;
  heroDescription: string;
  heroSpecs: string[];
  accent: string; // clase de gradiente tailwind, coherente con la landing
}

export type ProductStatus = "active" | "draft";

export interface Product {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  description: string;
  image: string;
  specs: string[];
  simulationPrompt?: string;
  status: ProductStatus;
  consultations: number; // mock de "más consultado"
}

export type PostStatus = "published" | "draft";

export interface BlogPost {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  accent: string;
  status: PostStatus;
  date: string; // ISO date
  views: number;
}

export interface WeeklyActivityPoint {
  label: string;
  quotes: number;
}
