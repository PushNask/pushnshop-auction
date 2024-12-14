import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FieldSelectorProps {
  selectedFields: string[];
  onChange: (fields: string[]) => void;
}

export const FieldSelector = ({ selectedFields, onChange }: FieldSelectorProps) => {
  const availableFields = [
    'id', 'title', 'description', 'price', 'status', 
    'created_at', 'category', 'seller_id', 'images'
  ];

  return (
    <div className="space-y-2">
      <Label>Fields to Include</Label>
      <div className="grid grid-cols-3 gap-2">
        {availableFields.map((field) => (
          <div key={field} className="flex items-center space-x-2">
            <Checkbox
              id={field}
              checked={selectedFields.includes(field)}
              onCheckedChange={(checked) => {
                const newFields = checked
                  ? [...selectedFields, field]
                  : selectedFields.filter(f => f !== field);
                onChange(newFields);
              }}
            />
            <Label htmlFor={field} className="text-sm">
              {field}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};