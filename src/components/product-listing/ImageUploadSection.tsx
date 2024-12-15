import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, Trash2 } from 'lucide-react';
import type { ProductImage } from '@/types/product';

interface ImageUploadSectionProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  error?: string;
}

export const ImageUploadSection = ({
  images,
  onImagesChange,
  error
}: ImageUploadSectionProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages: ProductImage[] = files.map((file, index) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      alt: file.name || 'Product image',
      order_number: images.length + index,
      isNew: true,
      file,
      preview: URL.createObjectURL(file)
    }));

    onImagesChange([...images, ...newImages]);
  };

  const handleRemove = (imageId: string) => {
    const newImages = images
      .filter(img => img.id !== imageId)
      .map((img, index) => ({ ...img, order_number: index }));
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Product Images ({images.length}/7)</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative aspect-square">
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
              onClick={() => handleRemove(image.id)}
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
                onChange={handleImageUpload}
                multiple
              />
            </Label>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};