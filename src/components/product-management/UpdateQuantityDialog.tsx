import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { ManagedProduct } from '@/types/product-management';

interface UpdateQuantityDialogProps {
  product: ManagedProduct;
  onClose: () => void;
  onUpdate: (quantity: number) => Promise<void>;
}

export const UpdateQuantityDialog = ({ product, onClose, onUpdate }: UpdateQuantityDialogProps) => {
  const [newQuantity, setNewQuantity] = useState(product.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(newQuantity);
      onClose();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
    setIsUpdating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Update Quantity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="quantity">New Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#0077B6] hover:bg-[#0077B6]/90"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Quantity'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};