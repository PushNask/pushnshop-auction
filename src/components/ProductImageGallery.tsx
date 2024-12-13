import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, Trash2 } from 'lucide-react';
import type { ProductImage } from '@/types/product-form';

interface ProductImageGalleryProps {
  images: ProductImage[];
  onImageAdd: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (imageId: string) => void;
}

export const ProductImageGallery = ({
  images,
  onImageAdd,
  onImageRemove
}: ProductImageGalleryProps) => {
  return (
    <div>
      <Label>Product Images ({images.length}/7)</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
        {images.map((image) => (
          <div key={image.id} className="relative aspect-square">
            <img
              src={image.url}
              alt="Product"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => onImageRemove(image.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {images.length < 7 && (
          <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
            <Label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center p-4"
            >
              <ImagePlus className="h-8 w-8 mb-2" />
              <span className="text-sm text-center">Add Image</span>
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onImageAdd}
                multiple
              />
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};