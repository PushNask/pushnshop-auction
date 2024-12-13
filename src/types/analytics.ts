export interface AnalyticsData {
  date: string;
  views: number;
  clicks: number;
  inquiries: number;
}

export interface AnalyticsStats {
  totalViews: number;
  totalClicks: number;
  activeListings: number;
  avgResponseTime: string;
  conversionRate: string;
  totalInquiries: number;
}