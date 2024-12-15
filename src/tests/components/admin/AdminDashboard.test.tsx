import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';

describe('AdminDashboard', () => {
  it('renders the admin dashboard', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Loading metrics.../i)).toBeInTheDocument();
  });
});
