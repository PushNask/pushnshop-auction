import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { ProductImage } from '@/types/product';

interface ImagePreviewProps {
  image: ProductImage;
  onRemove: (imageId: string) => void;
}

export const ImagePreview = ({ image, onRemove }: ImagePreviewProps) => {
  return (
    <div className="relative aspect-square">
      <img
        src={image.preview || image.url}
        alt={image.alt}
        className="w-full h-full object-cover rounded-lg"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => onRemove(image.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};