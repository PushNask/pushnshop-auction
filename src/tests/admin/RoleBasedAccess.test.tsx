import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn()
    }))
  }
}));

describe('Admin Role-Based Access Tests', () => {
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
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {ui}
        </QueryClientProvider>
      </BrowserRouter>
    );
  };

  it('should allow admin access to dashboard', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          user: { id: 'admin-id', email: 'admin@test.com' }
        }
      },
      error: null
    });

    vi.mocked(supabase.from().select().single).mockResolvedValueOnce({
      data: { role: 'admin' },
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    });

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
  });

  it('should redirect non-admin users', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          user: { id: 'user-id', email: 'user@test.com' }
        }
      },
      error: null
    });

    vi.mocked(supabase.from().select().single).mockResolvedValueOnce({
      data: { role: 'buyer' },
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    });

    const { container } = renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });

  it('should handle authentication errors gracefully', async () => {
    vi.mocked(supabase.auth.getSession).mockRejectedValueOnce(
      new Error('Authentication failed')
    );

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});