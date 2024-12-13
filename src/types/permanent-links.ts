export interface PermanentLink {
  id: number;
  url: string;
  status: 'available' | 'active';
  product?: {
    title: string;
    expires_at: string;
  } | null;
}