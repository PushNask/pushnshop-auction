import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  includeFields: string[];
  dateRange: [Date | null, Date | null];
}

export const useProductExport = () => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'xlsx',
    includeFields: ['title', 'description', 'price', 'status', 'created_at'],
    dateRange: [null, null]
  });

  const convertToCSV = (data: any[]) => {
    const headers = options.includeFields.join(',');
    const rows = data.map(item => 
      options.includeFields.map(field => 
        JSON.stringify(item[field] ?? '')
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const exportProducts = async () => {
    if (options.includeFields.length === 0) {
      toast({
        title: "Export Error",
        description: "Please select at least one field to export",
        variant: "destructive"
      });
      return;
    }

    setExporting(true);
    try {
      let query = supabase
        .from('products')
        .select(options.includeFields.join(','));

      if (options.dateRange[0] && options.dateRange[1]) {
        query = query
          .gte('created_at', options.dateRange[0].toISOString())
          .lte('created_at', options.dateRange[1].toISOString());
      }

      const { data, error } = await query;
      
      if (error) throw error;
      if (!data || data.length === 0) {
        toast({
          title: "No Data",
          description: "No products found matching your criteria",
          variant: "destructive"
        });
        return;
      }

      const filename = `products_export_${Date.now()}`;

      switch (options.format) {
        case 'csv':
          const csv = convertToCSV(data);
          saveAs(
            new Blob([csv], { type: 'text/csv;charset=utf-8' }), 
            `${filename}.csv`
          );
          break;

        case 'xlsx':
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Products');
          XLSX.writeFile(wb, `${filename}.xlsx`);
          break;

        case 'json':
          saveAs(
            new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), 
            `${filename}.json`
          );
          break;
      }

      toast({
        title: "Export Successful",
        description: "Your products have been exported successfully"
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your products",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return {
    options,
    setOptions,
    exporting,
    exportProducts
  };
};