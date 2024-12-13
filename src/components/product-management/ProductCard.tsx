import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit, RefreshCw, ShoppingBag, Timer, PackageSearch, Clock } from 'lucide-react';
import type { ManagedProduct } from '@/types/product-management';
import { formatCurrency, getTimeRemaining } from '@/utils/product';

interface ProductCardProps {
  product: ManagedProduct;
  onEdit: (product: ManagedProduct) => void;
  onRenew?: (product: ManagedProduct) => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { color: 'bg-green-500', text: 'Active' },
    pending: { color: 'bg-yellow-500', text: 'Pending' },
    expired: { color: 'bg-gray-500', text: 'Expired' },
    sold: { color: 'bg-blue-500', text: 'Sold Out' }
  };

  const config = statusConfig[status] || statusConfig.pending;
  return (
    <Badge className={`${config.color} text-white`}>
      {config.text}
    </Badge>
  );
};

export const ProductCard = ({ product, onEdit, onRenew }: ProductCardProps) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{product.title}</h3>
          <p className="text-sm text-gray-500">
            {formatCurrency(product.price, product.currency)}
          </p>
        </div>
        {getStatusBadge(product.status)}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <Label className="text-sm text-gray-500">Quantity</Label>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>{product.quantity} available</span>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-sm text-gray-500">Time Remaining</Label>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span>{getTimeRemaining(product.expiresAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <Label className="text-sm text-gray-500">Views</Label>
          <div className="flex items-center gap-2">
            <PackageSearch className="w-4 h-4" />
            <span>{product.views}</span>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-sm text-gray-500">WhatsApp Clicks</Label>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{product.whatsappClicks}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onEdit(product)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        {product.status === 'expired' && onRenew && (
          <Button 
            className="flex-1 bg-[#0077B6] hover:bg-[#0077B6]/90"
            onClick={() => onRenew(product)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Renew
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);