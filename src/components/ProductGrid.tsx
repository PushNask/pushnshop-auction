import { Loader2 } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  loadingRef: React.RefObject<HTMLDivElement>;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, loadingRef }) => (
  <main className="container mx-auto px-4 py-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="flex">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
    
    <div
      ref={loadingRef}
      className="flex justify-center items-center py-8"
    >
      {isLoading && (
        <Loader2 className="w-6 h-6 animate-spin" />
      )}
    </div>
  </main>
);