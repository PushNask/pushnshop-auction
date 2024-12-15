import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundaryWrapper } from "@/components/monitoring/ErrorBoundaryWrapper";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import "@/i18n/config";

// Lazy load route components
const HomePage = lazy(() => import("@/pages/HomePage"));
const AuthForm = lazy(() => import("@/components/auth/AuthForm"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ProductsPage = lazy(() => import("@/pages/ProductsPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AdminDashboard = lazy(() => import("@/components/admin/dashboard/AdminDashboard"));
const UserManagement = lazy(() => import("@/components/admin/users/UserManagement"));
const SystemMonitoring = lazy(() => import("@/components/admin/monitoring/SystemMonitoring"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SellPage = lazy(() => import("@/pages/SellPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <ErrorBoundaryWrapper>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Header />
              <div className="pt-16">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthForm />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/monitoring" element={<SystemMonitoring />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/sell" element={<SellPage />} />
                  </Routes>
                </Suspense>
              </div>
            </BrowserRouter>
          </div>
        </ErrorBoundaryWrapper>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;