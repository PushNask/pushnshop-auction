import { render, screen } from '@testing-library/react';
import { StatsOverview } from '@/components/admin/dashboard/StatsOverview';

const mockMetrics = {
  totalUsers: 100,
  usersTrend: 5,
  activeListings: 50,
  listingsTrend: 10,
  totalRevenue: 1000,
  revenueTrend: 15,
  systemHealth: 'Excellent' as const,
  systemStatus: {
    responseTime: 200,
    errorRate: 0.5
  }
};

describe('StatsOverview', () => {
  it('renders all metrics correctly', () => {
    render(<StatsOverview metrics={mockMetrics} isLoading={false} />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<StatsOverview metrics={mockMetrics} isLoading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});