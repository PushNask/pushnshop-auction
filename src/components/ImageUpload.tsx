import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { ProductImage } from '@/types/product';
import { IMAGE_CONFIG } from '@/config/constants';
import { ImagePreview } from './image-upload/ImagePreview';
import { UploadButton } from './image-upload/UploadButton';
import { validateImage } from './image-upload/ImageValidator';

interface ImageUploadProps {
  images?: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  error?: string;
}

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
          order_number: images.length + acc.length,
          file,
          isNew: true,
          preview: URL.createObjectURL(file)
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
      .map((img, index) => ({ ...img, order_number: index }));
    onChange(newImages);
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
            <ImagePreview
              key={image.id}
              image={image}
              onRemove={handleRemove}
            />
          ))}

          {(!images || images.length < IMAGE_CONFIG.MAX_IMAGES) && (
            <UploadButton
              currentCount={images?.length || 0}
              onFileSelect={(e) => handleFiles(e.target.files)}
            />
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