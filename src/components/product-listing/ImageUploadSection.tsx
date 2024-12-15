import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { ProductImage } from '@/types/product';

interface ImageUploadSectionProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export const ImageUploadSection = ({
  images,
  onImagesChange,
  maxImages = 7
}: ImageUploadSectionProps) => {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length + images.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images`);
        return;
      }

      const newImages: ProductImage[] = files.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        alt: file.name,
        order_number: images.length + index,
        file,
        isNew: true,
        preview: URL.createObjectURL(file)
      }));

      onImagesChange([...images, ...newImages]);
    },
    [images, maxImages, onImagesChange]
  );

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages.map((img, i) => ({ ...img, order_number: i })));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative aspect-square group">
              <img
                src={image.preview || image.url}
                alt={image.alt}
                className="w-full h-full object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {images.length < maxImages && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-sm text-gray-500">Add Image</span>
            </label>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Upload up to {maxImages} images. First image will be the cover.
        </p>
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;