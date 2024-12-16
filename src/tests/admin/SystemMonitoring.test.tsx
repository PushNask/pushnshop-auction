import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SystemMonitoring } from '@/components/admin/monitoring/SystemMonitoring';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      single: vi.fn()
    })),
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn()
    }))
  }
}));

describe('System Monitoring Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays system metrics correctly', async () => {
    const mockMetrics = {
      cpu: 45.5,
      memory: 60.2,
      disk: 75.0,
      response_time: 250,
      error_rate: 0.5,
      active_users: 100
    };

    vi.mocked(supabase.from().select().order().limit().single).mockResolvedValueOnce({
      data: mockMetrics,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    });

    render(<SystemMonitoring />);

    await waitFor(() => {
      expect(screen.getByText('45.5%')).toBeInTheDocument();
      expect(screen.getByText('60.2%')).toBeInTheDocument();
      expect(screen.getByText('250ms')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    vi.mocked(supabase.from().select().order().limit().single).mockImplementationOnce(() => 
      new Promise(() => {})
    );

    render(<SystemMonitoring />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    vi.mocked(supabase.from().select().order().limit().single).mockRejectedValueOnce(
      new Error('Failed to fetch metrics')
    );

    render(<SystemMonitoring />);

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});