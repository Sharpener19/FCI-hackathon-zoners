import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';

interface ZoningSearchProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchTermChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function ZoningSearch({
  searchTerm,
  selectedCategory,
  onSearchTermChange,
  onCategoryChange,
  onSearch,
  isLoading
}: ZoningSearchProps) {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'General Zoning', label: 'General Zoning' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Employment', label: 'Employment' },
    { value: 'Parks', label: 'Parks' },
    { value: 'Environmental', label: 'Environmental' },
    { value: 'Design', label: 'Design' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Special Policy', label: 'Special Policy' },
    { value: 'Heritage', label: 'Heritage' },
    { value: 'Signs', label: 'Signs' },
    { value: 'Transit-Oriented', label: 'Transit-Oriented' },
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Card className="p-6 mb-6 shadow-md">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Search by keyword or by-law number
            </label>
            <Input
              type="text"
              placeholder="e.g., 'residential density' or '0225-2007'"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Category
            </label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Note: This is a demonstration tool with mock data representing typical Mississauga zoning by-laws.
          </p>
          <Button 
            onClick={onSearch} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
