import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuantityChange?: (quantity: number) => void;
}

export const ProductCard = ({ product, className, onQuantityChange }: ProductCardProps) => {
  const [currentProduct, setCurrentProduct] = useState(product);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Update product when prop changes
  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  // Mock real-time updates (replace with your preferred state management)
  useEffect(() => {
    const timer = setInterval(() => {
      if (onQuantityChange && currentProduct.quantity > 0) {
        const newQuantity = currentProduct.quantity - 1;
        setCurrentProduct(prev => ({ ...prev, quantity: newQuantity }));
        onQuantityChange(newQuantity);
      }
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [currentProduct.quantity, onQuantityChange]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const handleContactSeller = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in your product: ${currentProduct.title} (${window.location.href})`
    );
    window.open(
      `https://wa.me/${currentProduct.sellerWhatsApp}?text=${message}`,
      '_blank'
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentProduct.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? currentProduct.images.length - 1 : prev - 1
    );
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(currentProduct.expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Gallery Component
  const Gallery = () => (
    <Dialog open={isGalleryOpen} onOpenChange={() => setIsGalleryOpen(false)}>
      <DialogContent className="max-w-screen-lg h-[80vh] flex flex-col p-0">
        <div className="relative flex-1 bg-black flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white z-10"
            onClick={() => setIsGalleryOpen(false)}
          >
            <X size={24} />
          </Button>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white"
            onClick={previousImage}
          >
            <ChevronLeft size={24} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white"
            onClick={nextImage}
          >
            <ChevronRight size={24} />
          </Button>

          {/* Main image */}
          <img
            src={currentProduct.images[currentImageIndex].url}
            alt={currentProduct.images[currentImageIndex].alt}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Thumbnails */}
        <div className="bg-black p-4">
          <div className="flex gap-2 overflow-x-auto">
            {currentProduct.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden 
                  ${currentImageIndex === index ? 'ring-2 ring-primary' : ''}`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Card className={`w-full max-w-sm mx-auto overflow-hidden ${className}`}>
        <div className="relative aspect-square bg-gray-100">
          <img
            src={currentProduct.images[0]?.url || "/placeholder.svg"}
            alt={currentProduct.images[0]?.alt || currentProduct.title}
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
              <span className="text-white text-xl font-bold">Sold Out</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {currentProduct.title}
          </h3>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-primary">
              ${currentProduct.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              {currentProduct.quantity} available
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
            Contact Seller
          </Button>
        </CardFooter>
      </Card>

      <Gallery />
    </>
  );
};