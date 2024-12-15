import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn()
    }))
  }
}));

describe('Role-Based Access Control', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restricts admin dashboard access to admin users', async () => {
    // Mock non-admin user
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          user: {
            id: 'test-id',
            email: 'test@example.com',
            user_metadata: { role: 'buyer' }
          }
        }
      },
      error: null
    } as any);

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/auth');
    });
  });

  it('allows admin access to admin dashboard', async () => {
    // Mock admin user
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          user: {
            id: 'admin-id',
            email: 'admin@example.com',
            user_metadata: { role: 'admin' }
          }
        }
      },
      error: null
    } as any);

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
    });
  });

  it('handles session loading state', async () => {
    vi.mocked(supabase.auth.getSession).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        data: { session: null },
        error: null
      }), 100))
    );

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/checking authorization/i)).toBeInTheDocument();
  });
});