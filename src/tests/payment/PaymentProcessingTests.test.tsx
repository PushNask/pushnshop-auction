import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createSupabaseMock } from '../utils/supabaseMocks';
import { PaymentProcessor } from '@/components/payment/PaymentProcessor';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('Payment Processing System', () => {
  const mockSupabase = createSupabaseMock();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Transaction Processing', () => {
    test('processes payment successfully', async () => {
      const mockPayment = {
        amount: 1000,
        currency: 'XAF',
        listingId: 'test-listing'
      };

      mockSupabase.from().insert.mockResolvedValueOnce({
        data: { id: 'payment-id', ...mockPayment },
        error: null
      });

      render(
        <PaymentProcessor
          amount={mockPayment.amount}
          currency={mockPayment.currency as 'XAF' | 'USD'}
          listingId={mockPayment.listingId}
        />
      );

      const processButton = screen.getByRole('button', { name: /process payment/i });
      fireEvent.click(processButton);

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('payments');
        expect(mockSupabase.from().insert).toHaveBeenCalled();
      });
    });

    test('handles currency conversion', async () => {
      render(
        <PaymentProcessor
          amount={100}
          currency="USD"
          listingId="test-listing"
        />
      );

      const amount = screen.getByText(/USD 100/);
      expect(amount).toBeInTheDocument();
    });

    test('handles payment errors gracefully', async () => {
      mockSupabase.from().insert.mockRejectedValueOnce(new Error('Payment failed'));

      render(
        <PaymentProcessor
          amount={1000}
          currency="XAF"
          listingId="test-listing"
        />
      );

      const processButton = screen.getByRole('button', { name: /process payment/i });
      fireEvent.click(processButton);

      await waitFor(() => {
        expect(screen.getByText(/payment.*failed/i)).toBeInTheDocument();
      });
    });
  });
});