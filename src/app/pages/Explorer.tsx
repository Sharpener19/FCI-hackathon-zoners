import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { Search, Filter, Building2, Maximize2, Car, Trees } from 'lucide-react';
import { municipalities, zoneRegulations } from '../data/municipalityData';

export function Explorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('all');
  const [selectedRestriction, setSelectedRestriction] = useState('all');
  const [maxDensityFilter, setMaxDensityFilter] = useState([400]);
  const [maxHeightFilter, setMaxHeightFilter] = useState([100]);

  const filteredZones = zoneRegulations.filter(zone => {
    const matchesSearch = searchTerm === '' ||
      zone.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.zoneCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.permittedUses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMunicipality = selectedMunicipality === 'all' || zone.municipalityId === selectedMunicipality;
    const matchesRestriction = selectedRestriction === 'all' || zone.restrictiveness === selectedRestriction;
    const matchesDensity = zone.maxDensity <= maxDensityFilter[0];
    const matchesHeight = zone.maxHeight <= maxHeightFilter[0];

    return matchesSearch && matchesMunicipality && matchesRestriction && matchesDensity && matchesHeight;
  });

  const getRestrictionColor = (level: string) => {
    switch (level) {
      case 'Very High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getMunicipalityName = (id: string) => {
    return municipalities.find(m => m.id === id)?.name || id;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-1">Zoning Explorer</h2>
        <p className="text-slate-600">
          Search and filter zoning regulations across municipalities
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Zone name, code, or use..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Municipality
            </label>
            <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
              <SelectTrigger>
                <SelectValue placeholder="All municipalities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Municipalities</SelectItem>
                {municipalities.map(muni => (
                  <SelectItem key={muni.id} value={muni.id}>{muni.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Restrictiveness
            </label>
            <Select value={selectedRestriction} onValueChange={setSelectedRestriction}>
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Very High">Very High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-3 text-sm font-medium text-slate-700">
              Max Density (≤ {maxDensityFilter[0]} units/hectare)
            </label>
            <Slider
              value={maxDensityFilter}
              onValueChange={setMaxDensityFilter}
              max={400}
              step={10}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium text-slate-700">
              Max Height (≤ {maxHeightFilter[0]}m)
            </label>
            <Slider
              value={maxHeightFilter}
              onValueChange={setMaxHeightFilter}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900">
            {filteredZones.length} Zone{filteredZones.length !== 1 ? 's' : ''} Found
          </h3>
        </div>

        {filteredZones.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-500">No zones match your filters. Try adjusting your criteria.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredZones.map(zone => (
              <Card key={zone.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900">{zone.zoneName}</h3>
                      <Badge variant="outline">{zone.zoneCode}</Badge>
                      <Badge className={getRestrictionColor(zone.restrictiveness)} variant="outline">
                        {zone.restrictiveness}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{getMunicipalityName(zone.municipalityId)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Restriction Score</p>
                    <p className="text-2xl font-semibold text-slate-900">{zone.restrictionScore}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Max Density</p>
                      <p className="text-sm font-medium">{zone.maxDensity} u/ha</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Maximize2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Max Height</p>
                      <p className="text-sm font-medium">{zone.maxHeight}m</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Car className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Parking</p>
                      <p className="text-sm font-medium">{zone.minParkingPerUnit}/unit</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Trees className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Green Space</p>
                      <p className="text-sm font-medium">{zone.minGreenSpace}%</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Permitted Uses</p>
                  <div className="flex flex-wrap gap-2">
                    {zone.permittedUses.map((use, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500">Min Lot Size</p>
                    <p className="text-sm">{zone.minLotSize}m²</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Max Coverage</p>
                    <p className="text-sm">{zone.maxLotCoverage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Front Setback</p>
                    <p className="text-sm">{zone.minSetbackFront}m</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Side Setback</p>
                    <p className="text-sm">{zone.minSetbackSide}m</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
