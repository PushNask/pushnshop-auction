import { AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  message: string;
  onAddNew: () => void;
}

export const EmptyState = ({ message, onAddNew }: EmptyStateProps) => (
  <div className="text-center py-12">
    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
    <p className="text-gray-500">{message}</p>
    <Button 
      className="mt-4 bg-[#0077B6] hover:bg-[#0077B6]/90"
      onClick={onAddNew}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add New Product
    </Button>
  </div>
);