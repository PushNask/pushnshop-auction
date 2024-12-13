import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImagePlus, Trash2, AlertCircle } from 'lucide-react';
import type { ProductImage } from '@/types/product';
import { IMAGE_CONFIG } from '@/config/constants';
import { validateImage } from '@/utils/product';

interface ImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  error?: string;
}

const ImageUpload = ({ images, onChange, error }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const totalImages = images.length + fileArray.length;

    if (totalImages > IMAGE_CONFIG.MAX_IMAGES) {
      onChange(images);
      return;
    }

    const validFiles = fileArray.reduce<ProductImage[]>((acc, file) => {
      const error = validateImage(file);
      if (!error) {
        acc.push({
          id: Math.random().toString(36).substring(7),
          url: URL.createObjectURL(file),
          alt: file.name,
          order: images.length + acc.length,
          isNew: true,
          file
        });
      }
      return acc;
    }, []);

    onChange([...images, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemove = (imageId: string) => {
    const newImages = images.filter(img => img.id !== imageId)
      .map((img, index) => ({ ...img, order: index }));
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors
          ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative aspect-square">
              <img
                src={image.url}
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

          {images.length < IMAGE_CONFIG.MAX_IMAGES && (
            <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
              <Label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center p-4"
              >
                <ImagePlus className="h-8 w-8 mb-2" />
                <span className="text-sm text-center">
                  Drop images here or click to upload
                  <br />
                  ({images.length}/{IMAGE_CONFIG.MAX_IMAGES})
                </span>
                <Input
                  id="image-upload"
                  type="file"
                  accept={IMAGE_CONFIG.ACCEPTED_TYPES.join(',')}
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files!)}
                  multiple
                />
              </Label>
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <p className="text-sm text-gray-500">
        Upload up to {IMAGE_CONFIG.MAX_IMAGES} images (JPEG, PNG, or WebP, max 2MB each)
      </p>
    </div>
  );
};

export default ImageUpload;