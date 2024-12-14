import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { EmptyState } from './EmptyState';
import { ProductBatchActions } from './ProductBatchActions';
import { AdvancedFilters } from './AdvancedFilters';
import { ProductExport } from './ProductExport';
import { useToast } from '@/hooks/use-toast';
import type { FilterState } from './AdvancedFilters';
import type { ManagedProduct } from '@/types/product-management';

export const ProductManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priceRange: [0, 1000000],
    categories: []
  });
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleEdit = (product: ManagedProduct) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleDelete = async (product: ManagedProduct) => {
    // Implement delete logic
    toast({
      title: "Product Deleted",
      description: "The product has been successfully removed."
    });
  };

  const handleRenew = async (product: ManagedProduct) => {
    // Implement renew logic
    toast({
      title: "Listing Renewed",
      description: "Your listing has been renewed successfully."
    });
  };

  const handleAddNew = () => {
    navigate('/products/new');
  };

  const handleBatchActionComplete = () => {
    setSelectedProducts([]);
    // Refresh products list
    // ... implement refresh logic
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Apply filters to products list
    // ... implement filter logic
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <Button 
            className="bg-[#0077B6] hover:bg-[#0077B6]/90 mt-4"
            onClick={handleAddNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>
        <ProductExport />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <AdvancedFilters onFilterChange={handleFilterChange} />

      {selectedProducts.length > 0 && (
        <ProductBatchActions
          selectedProducts={selectedProducts}
          onActionComplete={handleBatchActionComplete}
        />
      )}

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Active
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex gap-2">
            <Clock className="w-4 h-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex gap-2">
            <XCircle className="w-4 h-4" />
            Expired
          </TabsTrigger>
        </TabsList>

        {['active', 'pending', 'expired'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {products.filter(p => p.status === status).length > 0 ? (
              products
                .filter(p => p.status === status)
                .map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRenew={status === 'expired' ? handleRenew : undefined}
                  />
                ))
            ) : (
              <EmptyState 
                message={
                  status === 'active' 
                    ? "You don't have any active listings" 
                    : status === 'pending'
                    ? "No pending listings"
                    : "No expired listings"
                }
                onAddNew={handleAddNew}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProductManagement;