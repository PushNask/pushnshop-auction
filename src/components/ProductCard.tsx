import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ProductGallery } from './ProductGallery';
import type { Product } from '@/types/product';

const DEFAULT_PRODUCT: Product = {
  id: '1',
  permanentLinkId: '1', // Changed from number to string
  title: 'Sample Product',
  description: 'Sample product description',
  price: 99.99,
  currency: 'XAF',
  quantity: 5,
  images: [
    {
      id: '1',
      url: '/api/placeholder/400/400',
      alt: 'Sample product image',
      order_number: 1
    }
  ],
  status: 'active',
  sellerId: '1',
  sellerWhatsApp: '1234567890',
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  viewCount: 0
};

interface ProductCardProps {
  product?: Partial<Product>;
  className?: string;
  onQuantityChange?: (quantity: number) => void;
}

export const ProductCard = ({ product, className, onQuantityChange }: ProductCardProps) => {
  const { t } = useTranslation();
  const [currentProduct, setCurrentProduct] = useState<Product>({
    ...DEFAULT_PRODUCT,
    ...product
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setCurrentProduct(prev => ({
        ...prev,
        ...product
      }));
    }
  }, [product]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (onQuantityChange && currentProduct.quantity > 0) {
        const newQuantity = currentProduct.quantity - 1;
        setCurrentProduct(prev => ({ ...prev, quantity: newQuantity }));
        onQuantityChange(newQuantity);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [currentProduct.quantity, onQuantityChange]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const handleContactSeller = () => {
    const message = encodeURIComponent(
      t('products.whatsappMessage', {
        title: currentProduct.title,
        url: window.location.href
      })
    );
    window.open(
      `https://wa.me/${currentProduct.sellerWhatsApp}?text=${message}`,
      '_blank'
    );
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(currentProduct.expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return t('products.ended');

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return t('products.timeRemaining', { hours, minutes });
  };

  return (
    <>
      <Card className={`w-full max-w-sm mx-auto overflow-hidden ${className}`}>
        <div className="relative aspect-square bg-gray-100">
          <img
            src={currentProduct.images[0].url}
            alt={currentProduct.images[0].alt}
            className="object-cover w-full h-full cursor-pointer"
            onClick={() => handleImageClick(0)}
          />
          <div className="absolute top-2 right-2 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
            {getTimeRemaining()}
          </div>
          {currentProduct.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded-full text-xs">
              +{currentProduct.images.length - 1}
            </div>
          )}
          {currentProduct.quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl font-bold">{t('products.soldOut')}</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {currentProduct.title}
          </h3>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-primary">
              {currentProduct.currency === 'XAF' 
                ? t('products.priceXAF', { price: currentProduct.price.toLocaleString() })
                : t('products.priceUSD', { price: currentProduct.price.toFixed(2) })}
            </span>
            <span className="text-sm text-gray-500">
              {t('products.available', { count: currentProduct.quantity })}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-3">
            {currentProduct.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            className="flex-1 flex items-center justify-center gap-2"
            onClick={handleContactSeller}
            disabled={currentProduct.quantity === 0}
          >
            <MessageCircle size={20} />
            {t('products.contactSeller')}
          </Button>
        </CardFooter>
      </Card>

      <ProductGallery
        images={currentProduct.images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
      />
    </>
  );
};

export default ProductCard;
