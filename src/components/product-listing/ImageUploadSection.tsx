import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadSectionProps {
  images: File[];
  imageUrls: string[];
  onImagesChange: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  error?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_IMAGES = 7;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageUploadSection = ({
  images,
  imageUrls,
  onImagesChange,
  onImageRemove,
  error
}: ImageUploadSectionProps) => {
  const validateImage = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload JPEG, PNG, or WebP images.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File too large. Maximum size is 2MB.';
    }
    return null;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const totalImages = images.length + files.length;
    
    if (totalImages > MAX_IMAGES) {
      return;
    }

    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    files.forEach(file => {
      const error = validateImage(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length === 0) {
      onImagesChange(validFiles);
    }
  };

  return (
    <div>
      <Label>Product Images ({images.length}/{MAX_IMAGES})</Label>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={url}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => onImageRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {images.length < MAX_IMAGES && (
          <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
            <Label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center p-4"
            >
              <ImagePlus className="h-8 w-8 mb-2" />
              <span className="text-sm text-center">
                Add Image
                <br />
                (max 2MB)
              </span>
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
                multiple
              />
            </Label>
          </div>
        )}
      </div>
      {error && (
        <span className="text-sm text-red-500 block mt-2">{error}</span>
      )}
    </div>
  );
};