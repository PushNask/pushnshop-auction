import { useTranslation } from "react-i18next";

const ProductsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('products.title', 'Products')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Product grid will be implemented here */}
      </div>
    </div>
  );
};

export default ProductsPage;