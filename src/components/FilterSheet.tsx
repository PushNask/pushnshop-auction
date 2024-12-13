import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Filters } from "@/types/product"
import { type CheckedState } from "@radix-ui/react-checkbox"

interface FilterSheetProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({ filters, setFilters }) => (
  <div className="py-4 space-y-6">
    <div className="space-y-4">
      <h4 className="font-medium">Price Range</h4>
      <div className="px-2">
        <Slider
          defaultValue={[filters.minPrice || 0, filters.maxPrice || 1000]}
          max={1000}
          step={10}
          onValueChange={([min, max]) => 
            setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))
          }
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>${filters.minPrice || 0}</span>
          <span>${filters.maxPrice || 1000}</span>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h4 className="font-medium">Availability</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked: CheckedState) =>
              setFilters(prev => ({ ...prev, inStock: checked === true }))
            }
          />
          <label htmlFor="in-stock">In Stock</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="ending-soon"
            checked={filters.endingSoon}
            onCheckedChange={(checked: CheckedState) =>
              setFilters(prev => ({ ...prev, endingSoon: checked === true }))
            }
          />
          <label htmlFor="ending-soon">Ending Soon</label>
        </div>
      </div>
    </div>
  </div>
);