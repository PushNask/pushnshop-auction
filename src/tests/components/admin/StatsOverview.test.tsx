import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsOverview } from '@/components/admin/dashboard/StatsOverview';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [
            { status: 'active', payment_status: 'verified', price: 1000, seller_id: '1' },
            { status: 'active', payment_status: 'verified', price: 2000, seller_id: '2' },
          ],
          error: null
        })
      })
    })
  }
}));

describe('StatsOverview', () => {
  const queryClient = new QueryClient();

  it('renders stats correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StatsOverview />
      </QueryClientProvider>
    );

    // Wait for stats to load
    expect(await screen.findByText('Total Products')).toBeInTheDocument();
    expect(await screen.findByText('2')).toBeInTheDocument(); // Total products
    expect(await screen.findByText('2')).toBeInTheDocument(); // Active sellers
    expect(await screen.findByText('XAF 3,000')).toBeInTheDocument(); // Total revenue
  });
});