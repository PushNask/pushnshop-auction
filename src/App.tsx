import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundaryWrapper } from "@/components/monitoring/ErrorBoundaryWrapper";
import { MetricsProvider } from "@/hooks/useMetrics";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import "@/i18n/config";

// Lazy load route components
const HomePage = lazy(() => import("@/pages/HomePage"));
const PermanentLinks = lazy(() => import("@/pages/PermanentLinks"));
const AuthForm = lazy(() => import("@/components/auth/AuthForm"));
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));
const ProductListingForm = lazy(() => import("@/components/ProductListingForm"));
const MonitoringDashboard = lazy(() => import("@/components/monitoring/MonitoringDashboard"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));

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
              <Navbar />
              <div className="pt-16"> {/* Add padding to account for fixed navbar */}
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/permanent-links" element={<PermanentLinks />} />
                    <Route path="/auth" element={<AuthForm />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/sell" element={<ProductListingForm />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route 
                      path="/monitoring" 
                      element={
                        <MetricsProvider>
                          <MonitoringDashboard />
                        </MetricsProvider>
                      } 
                    />
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