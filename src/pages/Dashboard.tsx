import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileText, LayoutGrid, Newspaper, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BarChart } from "@/components/ui/BarChart";
import { useData } from "@/context/DataContext";
import { WEEKLY_ACTIVITY, MOCK_TOTAL_QUOTES } from "@/lib/mockData";
import { apiFetch } from "@/lib/api";

interface DashboardMetrics {
  totalQuotes: number;
  weeklyActivity: { label: string; quotes: number }[];
  categoryViews: { slug: string; shortLabel: string; label: string; total: number }[];
  topCategory: { slug: string; shortLabel: string; total: number } | null;
  topProduct: { title: string; consultations: number } | null;
  topPost: { title: string; views: number } | null;
}

export function Dashboard() {
  const { categories, products, posts } = useData();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    apiFetch<DashboardMetrics>("/dashboard/metrics").then(setMetrics).catch(() => undefined);
  }, []);

  const categoryViews = categories.map((cat) => ({
    slug: cat.slug,
    shortLabel: cat.shortLabel,
    label: cat.label,
    total: products.filter((p) => p.categorySlug === cat.slug).reduce((sum, p) => sum + p.consultations, 0),
  }));
  const fallbackTopCategory = [...categoryViews].sort((a, b) => b.total - a.total)[0];
  const visibleCategoryViews = metrics?.categoryViews ?? categoryViews;
  const topCategory = metrics?.topCategory ?? fallbackTopCategory;
  const maxCategoryTotal = Math.max(...visibleCategoryViews.map((c) => c.total), 1);
  const topProduct = metrics?.topProduct ?? [...products].sort((a, b) => b.consultations - a.consultations)[0];
  const topPost = metrics?.topPost ?? [...posts].sort((a, b) => b.views - a.views)[0];

  return (
    <div>
      <PageHeader
        eyebrow="Resumen"
        title="Buen dia - asi va El Cercho esta semana"
        description="Metricas clave del catalogo, blog y cotizaciones conectadas al backend."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={FileText}
          label="Cotizaciones recibidas"
          value={(metrics?.totalQuotes ?? MOCK_TOTAL_QUOTES).toLocaleString("es-MX")}
          trend={{ value: "+12% vs. mes anterior", direction: "up" }}
          index={0}
        />
        <MetricCard
          icon={LayoutGrid}
          label="Categoria mas vista"
          value={topCategory?.shortLabel ?? "-"}
          sublabel={`${topCategory?.total ?? 0} consultas acumuladas`}
          index={1}
        />
        <MetricCard
          icon={Newspaper}
          label="Blog con mas interaccion"
          value={topPost ? `${topPost.views.toLocaleString("es-MX")} vistas` : "-"}
          sublabel={topPost?.title}
          index={2}
        />
        <MetricCard
          icon={Star}
          label="Producto estrella"
          value={topProduct?.title ?? "-"}
          sublabel={`${topProduct?.consultations ?? 0} consultas`}
          index={3}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="font-display text-base font-semibold text-ink">Cotizaciones esta semana</h3>
          <p className="mt-1 font-body text-sm text-ink-muted">Solicitudes recibidas por dia, ultimos 7 dias.</p>
          <div className="mt-6">
            <BarChart data={(metrics?.weeklyActivity ?? WEEKLY_ACTIVITY).map((d) => ({ label: d.label, value: d.quotes }))} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="font-display text-base font-semibold text-ink">Interes por categoria</h3>
          <p className="mt-1 font-body text-sm text-ink-muted">Consultas acumuladas de productos, por linea.</p>
          <div className="mt-6 space-y-5">
            {visibleCategoryViews.map((cat) => (
              <ProgressBar
                key={cat.slug}
                label={cat.shortLabel}
                value={(cat.total / maxCategoryTotal) * 100}
                suffix={`${cat.total}`}
                colorClass={cat.slug === topCategory?.slug ? "bg-accent" : "bg-accent2"}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
