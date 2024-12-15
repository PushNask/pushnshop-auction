import { ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IMAGE_CONFIG } from '@/config/constants';

interface UploadButtonProps {
  currentCount: number;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadButton = ({ currentCount, onFileSelect }: UploadButtonProps) => {
  return (
    <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
      <Label
        htmlFor="image-upload"
        className="cursor-pointer flex flex-col items-center p-4"
      >
        <ImagePlus className="h-8 w-8 mb-2" />
        <span className="text-sm text-center">
          Drop images here or click to upload
          <br />
          ({currentCount}/{IMAGE_CONFIG.MAX_IMAGES})
        </span>
        <Input
          id="image-upload"
          type="file"
          accept={IMAGE_CONFIG.ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={onFileSelect}
          multiple
        />
      </Label>
    </div>
  );
};