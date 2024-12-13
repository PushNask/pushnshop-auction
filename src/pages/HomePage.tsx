import { ProductGrid } from "@/components/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/api";

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(0, "", {}),
  });

  return (
    <div className="container mx-auto p-4">
      <ProductGrid 
        products={data?.products || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default HomePage;