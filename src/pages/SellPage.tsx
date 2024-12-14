import { ProductListingForm } from '@/components/ProductListingForm';
import type { FormData } from '@/types/product-form';

const SellPage = () => {
  const handleSubmit = async (data: FormData) => {
    // Handle form submission
    console.log('Form submitted:', data);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a New Listing</h1>
      <ProductListingForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SellPage;