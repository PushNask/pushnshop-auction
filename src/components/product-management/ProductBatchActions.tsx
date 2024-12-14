import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Archive, Power, PowerOff, Trash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BatchActionsProps {
  selectedProducts: string[];
  onActionComplete: () => void;
}

export const ProductBatchActions = ({ selectedProducts, onActionComplete }: BatchActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBatchAction = async (action: 'delete' | 'active' | 'inactive' | 'archived') => {
    setIsLoading(true);
    try {
      if (action === 'delete') {
        await supabase
          .from('products')
          .delete()
          .in('id', selectedProducts);
      } else {
        await supabase
          .from('products')
          .update({ status: action })
          .in('id', selectedProducts);
      }

      toast({
        title: "Success",
        description: `Successfully ${action === 'delete' ? 'deleted' : 'updated'} ${selectedProducts.length} products`,
      });
      
      onActionComplete();
    } catch (error) {
      console.error('Batch action failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to perform batch action. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm text-muted-foreground">
        {selectedProducts.length} items selected
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBatchAction('active')}
          disabled={isLoading}
        >
          <Power className="w-4 h-4 mr-2" />
          Activate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBatchAction('inactive')}
          disabled={isLoading}
        >
          <PowerOff className="w-4 h-4 mr-2" />
          Deactivate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBatchAction('archived')}
          disabled={isLoading}
        >
          <Archive className="w-4 h-4 mr-2" />
          Archive
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleBatchAction('delete')}
          disabled={isLoading}
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};