import type { Currency, ListingStatus } from './product';

export interface Filters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  status?: ListingStatus;
  inStock: boolean;
  endingSoon: boolean;
  categories: string[];
  location: string;
}

export type FilterKey = keyof Filters;