import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentVerification } from '@/components/admin/dashboard/PaymentVerification';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [
            {
              id: '1',
              reference_number: 'REF001',
              amount: 1000,
              currency: 'XAF',
              payment_method: 'Mobile Money',
              listings: {
                products: {
                  title: 'Test Product',
                  seller_id: '1'
                }
              }
            }
          ],
          error: null
        })
      }),
      update: () => ({
        eq: () => ({ error: null })
      })
    })
  }
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('PaymentVerification', () => {
  const queryClient = new QueryClient();

  it('renders payment table correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PaymentVerification />
      </QueryClientProvider>
    );

    expect(await screen.findByText('REF001')).toBeInTheDocument();
    expect(await screen.findByText('Mobile Money')).toBeInTheDocument();
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
  });

  it('handles payment verification', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PaymentVerification />
      </QueryClientProvider>
    );

    const verifyButton = await screen.findByText('Verify');
    fireEvent.click(verifyButton);

    // Button should show processing state
    expect(await screen.findByText('Processing...')).toBeInTheDocument();
  });
});