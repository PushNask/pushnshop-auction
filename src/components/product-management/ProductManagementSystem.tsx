import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ProductCard } from './ProductCard';
import { UpdateQuantityDialog } from './UpdateQuantityDialog';
import { fetchUserProducts, updateProductQuantity, deleteProduct } from '@/services/product-management';
import type { ManagedProduct } from '@/types/product-management';

export const ProductManagementSystem = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ManagedProduct | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const userId = 'current-user-id'; // Replace with actual user ID from auth
        const userProducts = await fetchUserProducts(userId);
        setProducts(userProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  const handleQuantityUpdate = async (quantity: number) => {
    if (!selectedProduct) return;

    try {
      await updateProductQuantity(selectedProduct.id, quantity);
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, quantity }
          : p
      ));
      toast({
        title: "Success",
        description: "Product quantity updated successfully"
      });
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quantity. Please try again."
      });
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const handleDelete = async (product: ManagedProduct) => {
    try {
      await deleteProduct(product.id);
      setProducts(products.filter(p => p.id !== product.id));
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product"
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Products</h1>
        <p className="text-gray-500">Manage your product listings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onEdit={setSelectedProduct}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {selectedProduct && (
        <UpdateQuantityDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={handleQuantityUpdate}
        />
      )}
    </div>
  );
};
