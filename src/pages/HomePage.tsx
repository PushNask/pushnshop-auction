import { ProductGrid } from "@/components/ProductGrid";
import { SearchAndFilter } from "@/components/search/SearchAndFilter";

const HomePage = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <SearchAndFilter />
      <ProductGrid />
    </div>
  );
};

export default HomePage;