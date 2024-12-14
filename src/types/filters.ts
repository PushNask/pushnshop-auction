import type { Currency } from './product';

export interface Filters {
  search: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  inStock: boolean;
  endingSoon: boolean;
  categories: string[];
  location: string;
}

export type FilterKey = keyof Filters;