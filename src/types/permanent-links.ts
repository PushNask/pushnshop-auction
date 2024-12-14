export interface PermanentLink {
  id: number;
  url_key: string;
  url_path: string;
  current_listing_id?: string;
  status: 'active' | 'available';
  created_at: string;
  last_assigned_at: string;
  performance_score: number;
  rotation_count: number;
}

export interface PermanentLinkAnalytics {
  views: number;
  clicks: number;
  lastActivity: string;
}