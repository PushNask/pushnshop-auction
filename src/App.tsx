import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LayoutProvider } from '@/providers/LayoutProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/admin/AdminRoute';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Profile from '@/pages/Profile';
import Products from '@/pages/Products';
import ProductDetails from '@/pages/ProductDetails';
import CreateProduct from '@/pages/CreateProduct';
import EditProduct from '@/pages/EditProduct';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import PermanentLinks from '@/pages/PermanentLinks';
import NotFound from '@/pages/NotFound';

// Only import devtools in development
const ReactQueryDevtools = process.env.NODE_ENV === 'development' 
  ? lazy(() => import('@tanstack/react-query-devtools').then(d => ({
      default: d.ReactQueryDevtools
    })))
  : () => null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <LayoutProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/products/create" element={<CreateProduct />} />
                    <Route path="/products/edit/:id" element={<EditProduct />} />
                  </Route>

                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/permanent-links" element={<PermanentLinks />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </LayoutProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;