import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImagePlus, Trash2, AlertCircle } from 'lucide-react';
import type { ProductImage } from '@/types/product';
import { IMAGE_CONFIG } from '@/config/constants';

interface ImageUploadProps {
  images?: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  error?: string;
}

const validateImage = (file: File): string | null => {
  if (!IMAGE_CONFIG.ACCEPTED_TYPES.includes(file.type as "image/jpeg" | "image/png" | "image/webp")) {
    return 'Invalid file type. Please upload JPEG, PNG, or WebP images.';
  }
  if (file.size > IMAGE_CONFIG.MAX_SIZE) {
    return 'File too large. Maximum size is 2MB.';
  }
  return null;
};

const ImageUpload = ({ images = [], onChange, error }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

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
          alt: file.name || 'Product image',
          order: images.length + acc.length,
          isNew: true,
          file
        });
      }
      return acc;
    }, []);

    onChange([...images, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemove = (imageId: string) => {
    const newImages = images.filter(img => img.id !== imageId)
      .map((img, index) => ({ ...img, order: index }));
    onChange(newImages);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors
          ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${error ? 'border-destructive' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.isArray(images) && images.map((image) => (
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

          {(!images || images.length < IMAGE_CONFIG.MAX_IMAGES) && (
            <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
              <Label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center p-4"
              >
                <ImagePlus className="h-8 w-8 mb-2" />
                <span className="text-sm text-center">
                  Drop images here or click to upload
                  <br />
                  ({images?.length || 0}/{IMAGE_CONFIG.MAX_IMAGES})
                </span>
                <Input
                  id="image-upload"
                  type="file"
                  accept={IMAGE_CONFIG.ACCEPTED_TYPES.join(',')}
                  className="hidden"
                  onChange={handleInputChange}
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