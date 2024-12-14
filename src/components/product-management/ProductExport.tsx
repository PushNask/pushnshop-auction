import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ExportFormatSelect } from "./export/ExportFormatSelect";
import { FieldSelector } from "./export/FieldSelector";
import { useProductExport } from "./export/useProductExport";

export const ProductExport = () => {
  const { options, setOptions, exporting, exportProducts } = useProductExport();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ExportFormatSelect
          value={options.format}
          onChange={(format) => setOptions({ ...options, format })}
        />

        <FieldSelector
          selectedFields={options.includeFields}
          onChange={(fields) => setOptions({ ...options, includeFields: fields })}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <DateRangePicker
            value={options.dateRange}
            onChange={(value) => setOptions({ ...options, dateRange: value })}
          />
        </div>

        <Button
          onClick={exportProducts}
          disabled={exporting}
          className="w-full"
        >
          {exporting ? 'Exporting...' : 'Export Products'}
        </Button>
      </CardContent>
    </Card>
  );
};