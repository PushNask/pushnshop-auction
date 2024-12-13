import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, PackageSearch, Eye, Clock } from 'lucide-react';
import type { ManagedProduct } from '@/types/product-management';

interface ProductCardProps {
  product: ManagedProduct;
  onEdit: (product: ManagedProduct) => void;
  onDelete: (product: ManagedProduct) => void;
  onRenew?: (product: ManagedProduct) => void;
}

export const ProductCard = ({ product, onEdit, onDelete, onRenew }: ProductCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-500', text: 'Active' },
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      expired: { color: 'bg-gray-500', text: 'Expired' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold truncate">{product.title}</h3>
              {getStatusBadge(product.status)}
            </div>
            <p className="text-sm text-gray-500">
              {product.currency} {product.price.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <PackageSearch className="w-4 h-4" />
                {product.quantity} in stock
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {product.views} views
              </span>
              {product.expiresAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Expires in {Math.ceil((new Date(product.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))}h
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {product.status === 'expired' && onRenew ? (
            <Button
              size="sm"
              className="flex-1 bg-[#0077B6] hover:bg-[#0077B6]/90"
              onClick={() => onRenew(product)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Renew Listing
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onDelete(product)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};