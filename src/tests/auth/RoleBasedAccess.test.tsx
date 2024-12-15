import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

describe('Role Based Access', () => {
  const queryClient = new QueryClient();

  it('allows admin access to dashboard', () => {
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