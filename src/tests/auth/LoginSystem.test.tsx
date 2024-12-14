import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { supabase } from '@/integrations/supabase/client';
import { AuthError, Session, User, AuthResponse } from '@supabase/supabase-js';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

// Mock router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('LoginSystem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('handles successful login', async () => {
    const mockUser: User = {
      id: 'mock-user-id',
      aud: 'authenticated',
      email: 'test@example.com',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmation_sent_at: null,
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: {},
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      factors: null,
    };

    const mockSession: Session = {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    const mockAuthResponse: AuthResponse = {
      data: { user: mockUser, session: mockSession },
      error: null,
    };

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce(mockAuthResponse);

    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    // Switch to login tab if needed
    const loginTab = screen.getByRole('tab', { name: /login/i });
    fireEvent.click(loginTab);

    // Fill in login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('handles failed login attempts', async () => {
    const mockAuthResponse: AuthResponse = {
      data: { user: null, session: null },
      error: new AuthError('Invalid credentials', 400),
    };

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce(mockAuthResponse);

    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    // Switch to login tab if needed
    const loginTab = screen.getByRole('tab', { name: /login/i });
    fireEvent.click(loginTab);

    // Fill in login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('implements account lockout after multiple failed attempts', async () => {
    const mockAuthResponse: AuthResponse = {
      data: { user: null, session: null },
      error: new AuthError('Invalid credentials', 400),
    };

    // Mock multiple failed attempts
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockAuthResponse);

    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    // Switch to login tab if needed
    const loginTab = screen.getByRole('tab', { name: /login/i });
    fireEvent.click(loginTab);

    // Attempt login multiple times
    for (let i = 0; i < 5; i++) {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' },
      });
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
      });
    }

    // Verify lockout message
    await waitFor(() => {
      expect(screen.getByText(/too many failed attempts/i)).toBeInTheDocument();
    });
  });
});