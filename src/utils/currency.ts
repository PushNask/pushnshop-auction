import type { Currency } from '@/types/product';

export const formatCurrency = (amount: number, currency: Currency): string => {
  return currency === 'XAF' 
    ? `XAF ${amount.toLocaleString()}`
    : `$${amount.toFixed(2)}`;
};