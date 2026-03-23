import { Filter, Home, Maximize2, Car, Users } from 'lucide-react';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Filters } from '../../pages/Homepage';

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const housingTypes = [
    'Single detached',
    'Semi-detached',
    'Duplex',
    'Triplex',
    'Townhouse',
    'Apartment',
  ];

  const toggleHousingType = (type: string) => {
    const newTypes = filters.housingTypes.includes(type)
      ? filters.housingTypes.filter(t => t !== type)
      : [...filters.housingTypes, type];
    onFiltersChange({ ...filters, housingTypes: newTypes });
  };

  return (
    <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-slate-600" />
          <h2 className="font-semibold text-slate-900">Filters</h2>
        </div>

        <div className="mb-4">
          <Label className="mb-2 block">Municipality</Label>
          <Select 
            value={filters.municipality} 
            onValueChange={(v) => onFiltersChange({ ...filters, municipality: v as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="waterloo">Waterloo</SelectItem>
              <SelectItem value="guelph">Guelph</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Housing Types */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Home className="w-4 h-4 text-purple-600" />
            <Label className="font-medium">Housing Types</Label>
          </div>
          <div className="space-y-2">
            {housingTypes.map(type => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={type}
                  checked={filters.housingTypes.includes(type)}
                  onCheckedChange={() => toggleHousingType(type)}
                />
                <label htmlFor={type} className="text-sm text-slate-700 cursor-pointer">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Lot Size */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Maximize2 className="w-4 h-4 text-purple-600" />
            <Label className="font-medium">Lot Size (m²)</Label>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Min: {filters.minLotSize}m²</span>
                <span>Max: {filters.maxLotSize}m²</span>
              </div>
              <Slider
                value={[filters.minLotSize, filters.maxLotSize]}
                onValueChange={([min, max]) => 
                  onFiltersChange({ ...filters, minLotSize: min, maxLotSize: max })
                }
                min={0}
                max={5000}
                step={50}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Height Limits */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Maximize2 className="w-4 h-4 text-purple-600" />
            <Label className="font-medium">Height Limits (m)</Label>
          </div>
          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Min: {filters.minHeight}m</span>
              <span>Max: {filters.maxHeight}m</span>
            </div>
            <Slider
              value={[filters.minHeight, filters.maxHeight]}
              onValueChange={([min, max]) => 
                onFiltersChange({ ...filters, minHeight: min, maxHeight: max })
              }
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Parking Requirements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-purple-600" />
            <Label className="font-medium">Parking (spaces/unit)</Label>
          </div>
          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Min: {filters.minParking.toFixed(1)}</span>
              <span>Max: {filters.maxParking.toFixed(1)}</span>
            </div>
            <Slider
              value={[filters.minParking, filters.maxParking]}
              onValueChange={([min, max]) => 
                onFiltersChange({ ...filters, minParking: min, maxParking: max })
              }
              min={0}
              max={3}
              step={0.25}
              className="w-full"
            />
          </div>
        </div>

        {/* Dwelling Units */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-purple-600" />
            <Label className="font-medium">Dwelling Units Allowed</Label>
          </div>
          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Min: {filters.minDwellings}</span>
              <span>Max: {filters.maxDwellings}</span>
            </div>
            <Slider
              value={[filters.minDwellings, filters.maxDwellings]}
              onValueChange={([min, max]) => 
                onFiltersChange({ ...filters, minDwellings: min, maxDwellings: max })
              }
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-slate-200">
        <Label className="font-medium mb-3 block">Zone Color Legend</Label>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffdaff' }}></div>
            <span className="text-slate-700">Very High Restriction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#e388e1' }}></div>
            <span className="text-slate-700">High Restriction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9b2cb7' }}></div>
            <span className="text-slate-700">Medium Restriction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#640877' }}></div>
            <span className="text-slate-700">Low Restriction</span>
          </div>
        </div>
      </div>
    </aside>
  );
}