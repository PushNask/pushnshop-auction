import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ProductGalleryProps } from '@/types/product';

export const ProductGallery = ({
  images,
  isOpen,
  onClose,
  currentIndex,
  onIndexChange
}: ProductGalleryProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  return (
    <>
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        {images.length > 0 ? (
          <img
            src={images[currentIndex]?.url || '/placeholder.svg'}
            alt={images[currentIndex]?.alt || 'Product image'}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onClick={() => setHoveredIndex(currentIndex)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2 px-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onIndexChange(index)}
              className={`relative w-16 h-16 rounded-md overflow-hidden ${
                index === currentIndex ? 'ring-2 ring-primary' : ''
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="relative aspect-video">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            {images.length > 0 && (
              <img
                src={images[currentIndex]?.url}
                alt={images[currentIndex]?.alt}
                className="w-full h-full object-contain"
              />
            )}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleNext}
                  disabled={currentIndex === images.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductGallery;