import { useState } from 'react';
import { Search, MapPin, FileText, Shield } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface SearchBarProps {
  onSearch: (query: string, type: 'address' | 'keyword') => void;
  searchResults: any[];
  onSelectResult: (result: any) => void;
}

export function SearchBar({ onSearch, searchResults, onSelectResult }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'address' | 'keyword'>('address');
  const [showResults, setShowResults] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value, searchType);
    setShowResults(value.trim().length > 0);
  };

  const handleSelectResult = (result: any) => {
    onSelectResult(result);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectResult(searchResults[0]);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'parcel': return <MapPin className="w-4 h-4 text-blue-600" />;
      case 'regulation': return <Shield className="w-4 h-4 text-indigo-600" />;
      case 'document': return <FileText className="w-4 h-4 text-slate-600" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const placeholderText = searchType === 'address' 
    ? 'Search by address (e.g., "123 University Ave")' 
    : 'Search zoning rules (e.g., "two units allowed", "duplex permitted")';

  return (
    <div className="border-b border-slate-200 bg-white p-4 relative z-[9999]">
      <div className="max-w-4xl mx-auto flex gap-3">
        <Select value={searchType} onValueChange={(v) => setSearchType(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            <SelectItem value="address">Address</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder={placeholderText}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />

          {showResults && searchResults.length > 0 && (
            <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto shadow-lg z-[9999]">
              <div className="p-2">
                {searchResults.slice(0, 10).map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectResult(result)}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-start gap-3 transition-colors"
                  >
                    {getResultIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      {result.type === 'parcel' && (
                        <>
                          <p className="font-medium text-slate-900">{result.data.address}</p>
                          <p className="text-sm text-slate-600">
                            {result.data.zoneCode} • {result.data.area}m²
                          </p>
                        </>
                      )}
                      {result.type === 'regulation' && (
                        <>
                          <p className="font-medium text-slate-900">
                            {result.data.zoneCode} - {result.data.zoneName}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.data.permittedUses.slice(0, 3).map((use: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {use}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                      {result.type === 'document' && (
                        <>
                          <p className="font-medium text-slate-900">{result.data.title}</p>
                          <p className="text-sm text-slate-600">{result.data.type}</p>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      
    </div>
  );
}
