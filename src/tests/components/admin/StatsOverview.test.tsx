import { render, screen } from '@testing-library/react';
import { StatsOverview } from '@/components/admin/dashboard/StatsOverview';
import type { AdminDashboardMetrics } from '@/types/admin-dashboard';

describe('StatsOverview', () => {
  const mockMetrics: AdminDashboardMetrics = {
    overview: {
      totalUsers: 100,
      usersTrend: 5,
      activeListings: 50,
      listingsTrend: 10,
      totalRevenue: 10000,
      revenueTrend: 15,
      systemHealth: 'Excellent',
      systemStatus: {
        responseTime: 200,
        errorRate: 0.1
      }
    },
    userMetrics: {
      growth: [],
      demographics: []
    },
    productMetrics: {
      categories: []
    }
  };

  it('renders loading state', () => {
    render(<StatsOverview isLoading={true} />);
    expect(screen.getByText(/loading metrics/i)).toBeInTheDocument();
  });

  it('renders metrics correctly', () => {
    render(<StatsOverview metrics={mockMetrics} isLoading={false} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText(/10,000/)).toBeInTheDocument();
  });
});