export interface Filters {
  search: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  endingSoon: boolean;
  categories: string[];
  location: string;
}