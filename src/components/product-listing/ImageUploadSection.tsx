import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';
import type { ProductImage } from '@/types/product';

export interface ImageUploadSectionProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  error?: string;
}

export const ImageUploadSection = ({
  images,
  onImagesChange,
  error
}: ImageUploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      alt: file.name,
      order_number: images.length + index,
      file,
      isNew: true,
      preview: URL.createObjectURL(file)
    }));

    onImagesChange([...images, ...newImages]);
  }, [images, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    const newImages = [...images];
    const removed = newImages.splice(index, 1)[0];
    if (removed.preview) {
      URL.revokeObjectURL(removed.preview);
    }
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Product Images ({images.length}/7)
          </h3>
          {images.length < 7 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => handleFileChange(e.target.files)}
        />

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-2 border-dashed rounded-lg transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-gray-200'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {images.map((image, index) => (
            <div key={image.id} className="relative group aspect-square">
              <img
                src={image.preview || image.url}
                alt={image.alt}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};