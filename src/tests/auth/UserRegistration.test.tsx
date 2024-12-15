import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SignupForm } from '@/components/auth/SignupForm';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      resend: vi.fn()
    }
  }
}));

describe('User Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates required fields', async () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/whatsapp number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('validates WhatsApp number format', async () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const whatsappInput = screen.getByLabelText(/whatsapp number/i);
    fireEvent.change(whatsappInput, { target: { value: '123' } });
    fireEvent.blur(whatsappInput);

    await waitFor(() => {
      expect(screen.getByText(/invalid whatsapp number/i)).toBeInTheDocument();
    });
  });

  it('validates password strength', async () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('handles duplicate email registration', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'User already registered' }
    } as any);

    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const whatsappInput = screen.getByLabelText(/whatsapp number/i);
    const fullNameInput = screen.getByLabelText(/full name/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.change(whatsappInput, { target: { value: '+237612345678' } });
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/user already registered/i)).toBeInTheDocument();
    });
  });
});