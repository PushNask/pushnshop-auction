import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SystemMonitoring } from '@/components/admin/monitoring/SystemMonitoring';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({
          data: {
            cpu: 45.5,
            memory: 60.2,
            disk: 75.0,
            response_time: 250,
            error_rate: 0.5,
            active_users: 100
          },
          error: null
        }))
      }))
    }))
  }
}));

describe('System Monitoring Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays system metrics correctly', async () => {
    // Mock successful response
    const mockRpcResponse = {
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
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
    };
    vi.mocked(supabase.rpc).mockReturnValue(mockRpcResponse as any);

    render(<SystemMonitoring />);

    await waitFor(() => {
      expect(screen.getByText('45.5%')).toBeInTheDocument();
      expect(screen.getByText('60.2%')).toBeInTheDocument();
      expect(screen.getByText('250ms')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    // Mock pending response
    const mockPendingResponse = {
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockReturnValue(new Promise(() => {}))
      })
    };
    vi.mocked(supabase.rpc).mockReturnValue(mockPendingResponse as any);

    render(<SystemMonitoring />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Mock error response
    const mockErrorResponse = {
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockRejectedValue(new Error('Failed to fetch metrics'))
      })
    };
    vi.mocked(supabase.rpc).mockReturnValue(mockErrorResponse as any);

    render(<SystemMonitoring />);

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});