import type { Currency, ListingStatus } from './product';

export interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  total: number;
  hasMore: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface FilterState {
  search: string;
  status?: ListingStatus;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  sortBy?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}