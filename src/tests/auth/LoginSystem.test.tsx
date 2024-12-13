import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { supabase } from '@/integrations/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      resetPasswordForEmail: vi.fn()
    }
  }
}));

const queryClient = new QueryClient();

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Login System', () => {
  let mockNavigate: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate
      };
    });
    // Reset failed attempts counter
    localStorage.removeItem('failedLoginAttempts');
    localStorage.removeItem('lastFailedLogin');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful login with valid credentials', async () => {
    const mockSession = { user: { id: '123' } };
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { session: mockSession },
      error: null
    });

    renderWithProviders(<AuthForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should handle failed login attempts', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { session: null },
      error: new Error('Invalid credentials')
    });

    renderWithProviders(<AuthForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should implement account lockout after multiple failed attempts', async () => {
    // Simulate 5 failed attempts
    for (let i = 0; i < 5; i++) {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { session: null },
        error: new Error('Invalid credentials')
      });

      renderWithProviders(<AuthForm />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    }

    // Verify account is locked
    await waitFor(() => {
      expect(screen.getByText(/account is locked/i)).toBeInTheDocument();
    });
  });

  it('should handle password reset functionality', async () => {
    vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({
      data: {},
      error: null
    });

    renderWithProviders(<AuthForm />);

    // Click on forgot password link
    fireEvent.click(screen.getByText(/forgot password/i));

    // Enter email for password reset
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password reset email sent/i)).toBeInTheDocument();
    });
  });

  it('should maintain session after page reload', async () => {
    const mockSession = { user: { id: '123' } };
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: mockSession },
      error: null
    });

    renderWithProviders(<AuthForm />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // Add more test cases as needed
});