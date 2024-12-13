import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ProductImage } from '@/types/product';

interface ProductGalleryProps {
  images: ProductImage[];
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const ProductGallery = ({
  images,
  isOpen,
  onClose,
  currentIndex,
  onIndexChange,
}: ProductGalleryProps) => {
  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const previousImage = () => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-screen-lg h-[80vh] flex flex-col p-0">
        <div className="relative flex-1 bg-black flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white z-10"
            onClick={onClose}
          >
            <X size={24} />
          </Button>

          {images.length > 1 && (
            <>
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
            </>
          )}

          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {images.length > 1 && (
          <div className="bg-black p-4">
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => onIndexChange(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden 
                    ${currentIndex === index ? 'ring-2 ring-primary' : ''}`}
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
        )}
      </DialogContent>
    </Dialog>
  );
};