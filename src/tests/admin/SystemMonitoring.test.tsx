import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SystemMonitoring } from '@/components/admin/monitoring/SystemMonitoring';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: (functionName: string) => ({
      select: () => ({
        single: () => ({
          data: {
            cpu: 45.5,
            memory: 60.2,
            disk: 75.0,
            response_time: 250,
            error_rate: 0.5,
            active_users: 100
          },
          error: null
        })
      })
    })
  }
}));

describe('System Monitoring Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays system metrics correctly', async () => {
    render(<SystemMonitoring />);

    await waitFor(() => {
      expect(screen.getByText('45.5%')).toBeInTheDocument();
      expect(screen.getByText('60.2%')).toBeInTheDocument();
      expect(screen.getByText('250ms')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    vi.mocked(supabase.rpc).mockImplementationOnce(() => ({
      select: () => ({
        single: () => new Promise(() => {})
      })
    }));

    render(<SystemMonitoring />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    vi.mocked(supabase.rpc).mockImplementationOnce(() => ({
      select: () => ({
        single: () => Promise.reject(new Error('Failed to fetch metrics'))
      })
    }));

    render(<SystemMonitoring />);

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});