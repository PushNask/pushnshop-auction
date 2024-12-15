import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { PaymentHandler } from '@/components/payment/PaymentHandler';
import { PaymentProcessor } from '@/components/payment/PaymentProcessor';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '1',
          amount: 1000,
          currency: 'XAF',
          status: 'pending'
        },
        error: null
      })
    }))
  }
}));

describe('Payment System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('processes transactions correctly', async () => {
    render(<PaymentProcessor listingId="1" amount={1000} currency="XAF" />);
    
    const payButton = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(supabase.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 1000,
          currency: 'XAF'
        })
      );
    });
  });

  test('handles currency conversion', async () => {
    render(<PaymentHandler />);
    
    const currencySelect = screen.getByRole('combobox', { name: /currency/i });
    fireEvent.change(currencySelect, { target: { value: 'USD' } });
    
    await waitFor(() => {
      expect(screen.getByText(/USD/)).toBeInTheDocument();
    });
  });

  test('generates payment receipt', async () => {
    render(<PaymentHandler />);
    
    const payButton = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(screen.getByText(/payment receipt/i)).toBeInTheDocument();
      expect(screen.getByText(/reference number/i)).toBeInTheDocument();
    });
  });

  test('handles payment errors', async () => {
    vi.mocked(supabase.from().insert).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Payment failed' }
      })
    }));

    render(<PaymentProcessor listingId="1" amount={1000} currency="XAF" />);
    
    const payButton = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
  });
});