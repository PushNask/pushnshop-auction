import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

describe('AdminDashboard', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {component}
        </QueryClientProvider>
      </BrowserRouter>
    );
  };

  it('renders the admin dashboard', () => {
    renderWithProviders(<AdminDashboard />);
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  it('displays loading state', () => {
    renderWithProviders(<AdminDashboard />);
    expect(screen.getByText(/Loading metrics.../i)).toBeInTheDocument();
  });
});