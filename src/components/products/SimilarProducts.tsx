import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import type { Product } from '@/types/product';
import type { Database } from '@/integrations/supabase/types';

type ProductWithImages = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
  users: { whatsapp_number: string | null };
};

interface SimilarProductsProps {
  currentProduct: Product;
  limit?: number;
}

export function SimilarProducts({ currentProduct, limit = 4 }: SimilarProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      const priceRange = {
        min: currentProduct.price * 0.7,
        max: currentProduct.price * 1.3
      };

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            url,
            alt,
            order_number
          ),
          users!products_seller_id_fkey (
            whatsapp_number
          )
        `)
        .neq('id', currentProduct.id)
        .gte('price', priceRange.min)
        .lte('price', priceRange.max)
        .eq('status', 'active')
        .limit(limit);

      if (!error && data) {
        const mappedProducts: Product[] = data.map((product: ProductWithImages) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: Number(product.price),
          currency: product.currency,
          quantity: product.quantity,
          images: (product.product_images || []).map(img => ({
            id: img.id,
            url: img.url,
            alt: img.alt || '',
            order_number: img.order_number
          })),
          status: product.status as Product['status'],
          sellerId: product.seller_id,
          sellerWhatsApp: product.users?.whatsapp_number || '',
          createdAt: product.created_at,
          expiresAt: product.end_time || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          viewCount: 0
        }));
        setProducts(mappedProducts);
      }
      setLoading(false);
    };

    fetchSimilarProducts();
  }, [currentProduct.id, currentProduct.price, limit]);

  if (loading) return <LoadingSpinner />;

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Similar Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
