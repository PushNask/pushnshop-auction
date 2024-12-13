export interface Filters {
  priceRange: [number, number];
  inStock: boolean;
  endingSoon: boolean;
  categories: string[];
  location: string;
}

export type FilterKey = keyof Filters;