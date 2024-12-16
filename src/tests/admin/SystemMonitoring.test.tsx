import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SystemMonitoring } from '@/components/admin/monitoring/SystemMonitoring';
import { supabase } from '@/integrations/supabase/client';
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn().mockReturnValue({
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
        } as PostgrestSingleResponse<any>)
      })
    })
  }
}));

describe('System Monitoring Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays system metrics correctly', async () => {
    const mockResponse: PostgrestSingleResponse<any> = {
      data: {
        cpu: 45.5,
        memory: 60.2,
        disk: 75.0,
        response_time: 250,
        error_rate: 0.5,
        active_users: 100
      },
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    };

    vi.mocked(supabase.rpc).mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue(mockResponse)
      })
    } as any);

    render(<SystemMonitoring />);

    await waitFor(() => {
      expect(screen.getByText('45.5%')).toBeInTheDocument();
      expect(screen.getByText('60.2%')).toBeInTheDocument();
      expect(screen.getByText('250ms')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
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