import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '@/components/auth/SignupForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock the dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn()
    }
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates required fields', async () => {
    render(<SignupForm />);
    
    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/whatsapp number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<SignupForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('validates WhatsApp number format', async () => {
    render(<SignupForm />);
    
    const whatsappInput = screen.getByLabelText(/whatsapp number/i);
    fireEvent.change(whatsappInput, { target: { value: '123' } });
    fireEvent.blur(whatsappInput);

    await waitFor(() => {
      expect(screen.getByText(/invalid whatsapp number/i)).toBeInTheDocument();
    });
  });

  it('validates password strength', async () => {
    render(<SignupForm />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('validates password confirmation match', async () => {
    render(<SignupForm />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } });
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    });
    supabase.auth.signUp = mockSignUp;

    render(<SignupForm />);
    
    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/whatsapp number/i), { target: { value: '+237612345678' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass123!' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'StrongPass123!',
        options: expect.objectContaining({
          data: {
            full_name: 'Test User',
            whatsapp_number: '+237612345678',
            role: 'buyer'
          }
        })
      });
    });
  });

  it('handles duplicate email error', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'User already registered' }
    });
    supabase.auth.signUp = mockSignUp;

    render(<SignupForm />);
    
    // Fill in form with existing email
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/whatsapp number/i), { target: { value: '+237612345678' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass123!' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/this email is already registered/i)).toBeInTheDocument();
    });
  });
});