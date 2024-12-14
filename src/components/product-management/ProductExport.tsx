import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ExportFormat = 'csv' | 'xlsx' | 'json';

interface ExportOptions {
  format: ExportFormat;
  includeFields: string[];
  dateRange: [Date | null, Date | null];
}

const AVAILABLE_FIELDS = [
  'id',
  'title',
  'description',
  'price',
  'status',
  'created_at',
  'category',
  'seller_id',
  'quantity'
] as const;

export const ProductExport = () => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'xlsx',
    includeFields: ['title', 'description', 'price', 'status', 'created_at'],
    dateRange: [null, null]
  });

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

  const convertToCSV = (data: any[]): string => {
    const headers = options.includeFields.join(',');
    const rows = data.map(item => 
      options.includeFields.map(field => 
        JSON.stringify(item[field] ?? '')
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div className="space-y-4">
        <div>
          <Label>Export Format</Label>
          <Select
            value={options.format}
            onValueChange={(value: ExportFormat) => 
              setOptions(prev => ({ ...prev, format: value }))
            }
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Fields to Include</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
            {AVAILABLE_FIELDS.map((field) => (
              <div key={field} className="flex items-center space-x-2">
                <Checkbox
                  id={field}
                  checked={options.includeFields.includes(field)}
                  onCheckedChange={(checked) => {
                    setOptions(prev => ({
                      ...prev,
                      includeFields: checked
                        ? [...prev.includeFields, field]
                        : prev.includeFields.filter(f => f !== field)
                    }));
                  }}
                />
                <label
                  htmlFor={field}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Date Range</Label>
          <div className="mt-2">
            <DateRangePicker
              value={options.dateRange}
              onChange={(value) => 
                setOptions(prev => ({ ...prev, dateRange: value }))
              }
            />
          </div>
        </div>

        <Button
          onClick={exportProducts}
          disabled={exporting}
          className="w-full"
        >
          {exporting ? 'Exporting...' : 'Export Products'}
        </Button>
      </div>
    </div>
  );
};