import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SystemMonitoring from '@/components/admin/monitoring/SystemMonitoring';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis()
    }))
  }
}));

describe('System Monitoring Tests', () => {
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

  it('should display system metrics', async () => {
    const mockMetrics = {
      cpu_usage: 45,
      memory_usage: 60,
      response_time: 250,
      error_rate: 0.5
    };

    vi.mocked(supabase.from().limit).mockResolvedValueOnce({
      data: [mockMetrics],
      error: null
    });

    renderWithProviders(<SystemMonitoring />);

    await waitFor(() => {
      expect(screen.getByText(/CPU Usage/i)).toBeInTheDocument();
      expect(screen.getByText(/Memory Usage/i)).toBeInTheDocument();
      expect(screen.getByText(/Response Time/i)).toBeInTheDocument();
      expect(screen.getByText(/Error Rate/i)).toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    vi.mocked(supabase.from().limit).mockImplementationOnce(() => 
      new Promise(() => {})
    );

    renderWithProviders(<SystemMonitoring />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    vi.mocked(supabase.from().limit).mockRejectedValueOnce(
      new Error('Failed to fetch metrics')
    );

    renderWithProviders(<SystemMonitoring />);

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});