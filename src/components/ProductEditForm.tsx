import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import type { ProductEditFormProps } from './product-edit/types';
import { useProductForm } from './product-edit/useProductForm';

export const ProductEditForm = ({ initialProduct, onSave }: ProductEditFormProps) => {
  const { product, handleInputChange, handleImageChange, handleSubmit } = useProductForm(initialProduct, onSave);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={product.title || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={product.price || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              value={product.currency}
              onChange={(e) => handleInputChange(e as any)}
              className="w-full p-2 border rounded"
            >
              <option value="XAF">XAF</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <Label htmlFor="images">Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const newImages = files.map((file, index) => ({
                  id: `temp-${Date.now()}-${index}`,
                  url: URL.createObjectURL(file),
                  alt: file.name,
                  order_number: (product.images?.length || 0) + index + 1,
                  file
                }));
                handleImageChange([...(product.images || []), ...newImages]);
              }}
              className="mt-1"
            />
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {product.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="mt-6">
          Save Product
        </Button>
      </Card>
    </form>
  );
};