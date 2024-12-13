import { AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  message: string;
  onAddNew: () => void;
}

export const EmptyState = ({ message, onAddNew }: EmptyStateProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-12">
      <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">{t('products.management.noProducts')}</h3>
      <p className="text-gray-500">{message}</p>
      <Button 
        className="mt-4 bg-[#0077B6] hover:bg-[#0077B6]/90"
        onClick={onAddNew}
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('products.management.addNew')}
      </Button>
    </div>
  );
};