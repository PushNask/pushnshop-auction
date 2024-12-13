export interface Product {
  id: number;
  title: string;
  price: number;
  timeLeft: string;
  quantity: number;
  description: string;
}

export interface Filters {
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  endingSoon: boolean;
}