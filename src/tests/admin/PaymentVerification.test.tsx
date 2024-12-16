import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaymentVerification } from '@/components/admin/dashboard/PaymentVerification';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      single: vi.fn()
    }))
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
    const mockPayment = {
      id: '1',
      amount: 1000,
      currency: 'XAF',
      status: 'pending',
      reference_number: 'REF001',
      payment_method: 'bank_transfer'
    };

    vi.mocked(supabase.from().single).mockResolvedValueOnce({
      data: mockPayment,
      error: null
    });

    renderWithProviders(<PaymentVerification />);

    await waitFor(() => {
      expect(screen.getByText('REF001')).toBeInTheDocument();
      expect(screen.getByText('XAF 1,000')).toBeInTheDocument();
    });
  });

  it('should handle payment verification', async () => {
    const mockPayment = {
      id: '1',
      amount: 1000,
      currency: 'XAF',
      status: 'pending'
    };

    vi.mocked(supabase.from().single).mockResolvedValueOnce({
      data: mockPayment,
      error: null
    });

    vi.mocked(supabase.from().update).mockResolvedValueOnce({
      data: { ...mockPayment, status: 'completed' },
      error: null
    });

    renderWithProviders(<PaymentVerification />);

    await waitFor(() => {
      const verifyButton = screen.getByRole('button', { name: /verify/i });
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });

  it('should handle verification errors', async () => {
    vi.mocked(supabase.from().single).mockRejectedValueOnce(
      new Error('Verification failed')
    );

    renderWithProviders(<PaymentVerification />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});