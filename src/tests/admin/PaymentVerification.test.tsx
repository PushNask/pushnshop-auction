import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaymentVerification } from '@/components/admin/dashboard/PaymentVerification';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: (query: string) => ({
        eq: (column: string, value: string) => ({
          data: [{
            id: '1',
            amount: 1000,
            currency: 'XAF',
            status: 'pending',
            reference_number: 'REF001',
            payment_method: 'bank_transfer',
            listing: {
              product: {
                seller: {
                  full_name: 'Test Seller'
                }
              }
            }
          }],
          error: null
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: string) => ({
          data: { ...data, status: 'completed' },
          error: null
        })
      })
    })
  }
}));

describe('Payment Verification Tests', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('should display pending payments', async () => {
    renderWithProviders(<PaymentVerification />);

    await waitFor(() => {
      expect(screen.getByText('REF001')).toBeInTheDocument();
      expect(screen.getByText(/XAF/)).toBeInTheDocument();
    });
  });

  it('should handle payment verification', async () => {
    renderWithProviders(<PaymentVerification />);

    await waitFor(() => {
      const verifyButton = screen.getByRole('button', { name: /verify/i });
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });
  });
});