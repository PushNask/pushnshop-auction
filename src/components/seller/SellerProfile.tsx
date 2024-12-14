import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SellerProfileProps {
  seller: {
    id: string;
    fullName: string;
    whatsappNumber: string;
    joinDate: string;
    totalListings?: number;
    avatar?: string;
  };
  onContactClick: () => void;
}

export function SellerProfile({ seller, onContactClick }: SellerProfileProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            {seller.avatar ? (
              <img
                src={seller.avatar}
                alt={seller.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-600">
                {seller.fullName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{seller.fullName}</h3>
            {seller.totalListings !== undefined && (
              <p className="text-sm text-gray-600">
                {seller.totalListings} active listings
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Member since</span>
            <p>{new Date(seller.joinDate).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-gray-600">WhatsApp</span>
            <p>{seller.whatsappNumber}</p>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={onContactClick}
        >
          Contact Seller
        </Button>
      </CardContent>
    </Card>
  );
}