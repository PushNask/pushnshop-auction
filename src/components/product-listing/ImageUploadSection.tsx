import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { IMAGE_CONFIG } from '@/config/constants';

interface ProductImage {
  id: string;
  file: File;
  preview: string;
}

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
    
    if (images.length + files.length > IMAGE_CONFIG.MAX_IMAGES) {
      return;
    }

    const newImages = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file)
    }));

    onImagesChange([...images, ...newImages]);
  };

  const removeImage = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  return (
    <div className="space-y-2">
      <Label>Product Images ({images.length}/{IMAGE_CONFIG.MAX_IMAGES})</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map(image => (
          <div key={image.id} className="relative aspect-square">
            <img
              src={image.preview}
              alt="Product preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeImage(image.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {images.length < IMAGE_CONFIG.MAX_IMAGES && (
          <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center p-4"
            >
              <Plus className="h-8 w-8 mb-2" />
              <span className="text-sm text-center">
                Add Image
                <br />
                (max {IMAGE_CONFIG.MAX_SIZE / (1024 * 1024)}MB)
              </span>
              <Input
                id="image-upload"
                type="file"
                accept={IMAGE_CONFIG.ACCEPTED_TYPES.join(',')}
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