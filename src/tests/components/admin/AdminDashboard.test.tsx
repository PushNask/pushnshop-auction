import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuthCheck hook
vi.mock('@/hooks/useAuthCheck', () => ({
  useAuthCheck: () => ({
    isAuthorized: true,
    isChecking: false
  })
}));

describe('AdminDashboard', () => {
  const queryClient = new QueryClient();

  it('renders dashboard when authorized', () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });
});