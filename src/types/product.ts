export type Duration = '24h' | '48h' | '72h' | '96h' | '120h';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order_number: number;
  file?: File;
  isNew?: boolean;
  preview?: string;
}
