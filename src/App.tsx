import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { UsersPage } from "@/pages/UsersPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { BlogPage } from "@/pages/BlogPage";
import { QuotesPage } from "@/pages/QuotesPage";
import { InsumosPage } from "@/pages/InsumosPage";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/usuarios" element={<UsersPage />} />
                <Route path="/categorias" element={<CategoriesPage />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/cotizaciones" element={<QuotesPage />} />
                <Route path="/insumos" element={<InsumosPage />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
