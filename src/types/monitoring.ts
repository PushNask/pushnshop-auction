export interface ErrorLog {
  id: string;
  message: string;
  timestamp: string;
}

export interface PerformanceMetric {
  timestamp: string;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
}

export interface Metrics {
  activeUsers: number;
  activeListings: number;
  averageResponseTime: number;
  errorRate: number;
  recentErrors: ErrorLog[];
  performanceData: PerformanceMetric[];
}