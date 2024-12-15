import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductGallery } from './ProductGallery';
import type { Product, Currency } from '@/types/product';

const DEFAULT_PRODUCT: Partial<Product> = {
  id: '1',
  permanentLinkId: '1',
  title: 'Sample Product',
  description: 'Sample product description',
  price: 99.99,
  currency: 'XAF' as Currency,
  images: [],
  status: 'active',
  viewCount: 0
};

interface ProductCardProps {
  product?: Product;
  onAction?: () => void;
  actionLabel?: string;
}

export const ProductCard = ({ 
  product = DEFAULT_PRODUCT as Product,
  onAction,
  actionLabel = 'View Details'
}: ProductCardProps) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Card className="overflow-hidden">
      <ProductGallery 
        images={product.images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <Badge variant="secondary">{product.status}</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            {product.currency} {product.price.toLocaleString()}
          </span>
          {onAction && (
            <Button onClick={onAction} variant="secondary">
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};