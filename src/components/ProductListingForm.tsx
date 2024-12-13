import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImagePlus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  title: string;
  description: string;
  price: string;
  currency: 'XAF' | 'USD';
  quantity: string;
  duration: '24' | '48' | '72' | '96' | '120';
  images: File[];
  imageUrls: string[];
}

const DURATION_PRICES = {
  '24': { XAF: 5000, USD: 10 },
  '48': { XAF: 7500, USD: 15 },
  '72': { XAF: 10000, USD: 20 },
  '96': { XAF: 12500, USD: 25 },
  '120': { XAF: 15000, USD: 30 },
} as const;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_IMAGES = 7;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface FormErrors extends Partial<Record<keyof FormData, string>> {
  submit?: string;
}

const ProductListingForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    currency: 'XAF',
    quantity: '',
    duration: '24',
    images: [],
    imageUrls: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const totalImages = formData.images.length + files.length;
    
    if (totalImages > MAX_IMAGES) {
      setErrors(prev => ({
        ...prev,
        images: `Maximum ${MAX_IMAGES} images allowed.`
      }));
      return;
    }

    const validationErrors: string[] = [];
    const validFiles: File[] = [];
    const validUrls: string[] = [];

    files.forEach(file => {
      const error = validateImage(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
        validUrls.push(URL.createObjectURL(file));
      }
    });

    if (validationErrors.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: validationErrors.join(' ')
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles],
      imageUrls: [...prev.imageUrls, ...validUrls]
    }));
    setErrors(prev => ({ ...prev, images: undefined }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success!",
        description: "Your listing has been created.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'XAF',
        quantity: '',
        duration: '24',
        images: [],
        imageUrls: [],
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create listing. Please try again.'
      }));
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create listing. Please try again.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Listing</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Product title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <span className="text-sm text-red-500">{errors.title}</span>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description"
                className={errors.description ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description}</span>
              )}
            </div>

            {/* Price and Currency */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <span className="text-sm text-red-500">{errors.price}</span>
                )}
              </div>

              <div className="w-32">
                <Label>Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleSelectChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XAF">XAF</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity Available</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="1"
                min="1"
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && (
                <span className="text-sm text-red-500">{errors.quantity}</span>
              )}
            </div>

            {/* Duration Selection */}
            <div>
              <Label>Listing Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleSelectChange('duration', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">
                    24 hours - {formData.currency === 'XAF' ? 'XAF 5,000' : '$10'}
                  </SelectItem>
                  <SelectItem value="48">
                    48 hours - {formData.currency === 'XAF' ? 'XAF 7,500' : '$15'}
                  </SelectItem>
                  <SelectItem value="72">
                    72 hours - {formData.currency === 'XAF' ? 'XAF 10,000' : '$20'}
                  </SelectItem>
                  <SelectItem value="96">
                    96 hours - {formData.currency === 'XAF' ? 'XAF 12,500' : '$25'}
                  </SelectItem>
                  <SelectItem value="120">
                    120 hours - {formData.currency === 'XAF' ? 'XAF 15,000' : '$30'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Product Images ({formData.images.length}/{MAX_IMAGES})</Label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.imageUrls.map((url, index) => (
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
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {formData.images.length < MAX_IMAGES && (
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
            {errors.images && (
              <span className="text-sm text-red-500 block mt-2">{errors.images}</span>
            )}
          </div>

          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#0077B6] hover:bg-[#0077B6]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Listing...
              </>
            ) : (
              'Create Listing'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProductListingForm;
