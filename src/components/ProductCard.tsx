import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Product } from "@/types/product"

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden">
      <div className="relative aspect-square bg-gray-100">
        <img
          src="/placeholder.svg"
          alt={product.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
          {product.timeLeft}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold">${product.price}</span>
          <span className="text-sm text-gray-500">{product.quantity} available</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-3">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <MessageCircle size={20} />
          Contact Seller
        </Button>
      </CardFooter>
    </Card>
  );
};