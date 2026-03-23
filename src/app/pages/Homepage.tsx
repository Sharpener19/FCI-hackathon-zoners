import { useState } from 'react';
import { MapView } from '../components/map/MapView';
import { FilterSidebar } from '../components/map/FilterSidebar';
import { SearchBar } from '../components/map/SearchBar';
import { ParcelDetail } from '../components/map/ParcelDetail';
import { parcels, zoneRegulations, zoningDocuments } from '../data/waterlooGuelphData';
import type { Parcel } from '../data/waterlooGuelphData';

export interface Filters {
  municipality: 'waterloo' | 'guelph';
  housingTypes: string[];
  minLotSize: number;
  maxLotSize: number;
  minHeight: number;
  maxHeight: number;
  minParking: number;
  maxParking: number;
  minDwellings: number;
  maxDwellings: number;
}

export function Homepage() {
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [filters, setFilters] = useState<Filters>({
    municipality: 'waterloo',
    housingTypes: [],
    minLotSize: 0,
    maxLotSize: 5000,
    minHeight: 0,
    maxHeight: 50,
    minParking: 0,
    maxParking: 3,
    minDwellings: 0,
    maxDwellings: 100,
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (query: string, type: 'address' | 'keyword') => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    if (type === 'address') {
      // Search parcels by address
      const results = parcels.filter(p => 
        p.address.toLowerCase().includes(lowerQuery)
      );
      setSearchResults(results.map(p => ({ type: 'parcel', data: p })));
    } else {
      // Keyword search across regulations and documents
      const regulationResults = zoneRegulations.filter(z => {
        const searchText = [
          z.zoneName,
          z.zoneCode,
          ...z.permittedUses,
          `${z.maxDensity} units`,
          `${z.minParkingPerUnit} parking`,
        ].join(' ').toLowerCase();
        return searchText.includes(lowerQuery);
      });

      const documentResults = zoningDocuments.filter(d =>
        d.searchableText.toLowerCase().includes(lowerQuery)
      );

      const parcelResults = parcels.filter(p => {
        const zone = zoneRegulations.find(z => 
          z.municipalityId === p.municipalityId && z.zoneCode === p.zoneCode
        );
        if (!zone) return false;
        const searchText = zone.permittedUses.join(' ').toLowerCase();
        return searchText.includes(lowerQuery);
      });

      setSearchResults([
        ...regulationResults.map(r => ({ type: 'regulation', data: r })),
        ...documentResults.map(d => ({ type: 'document', data: d })),
        ...parcelResults.map(p => ({ type: 'parcel', data: p }))
      ]);
    }
  };

  const filteredParcels = parcels.filter(parcel => {
    // Municipality filter - now always filtering to selected municipality
    if (parcel.municipalityId !== filters.municipality) {
      return false;
    }

    // Get zone regulation for this parcel
    const zone = zoneRegulations.find(z => 
      z.municipalityId === parcel.municipalityId && z.zoneCode === parcel.zoneCode
    );
    if (!zone) return true;

    // Lot size filter
    if (parcel.area < filters.minLotSize || parcel.area > filters.maxLotSize) {
      return false;
    }

    // Height filter
    if (zone.maxHeight < filters.minHeight || zone.maxHeight > filters.maxHeight) {
      return false;
    }

    // Parking filter
    if (zone.minParkingPerUnit < filters.minParking || zone.minParkingPerUnit > filters.maxParking) {
      return false;
    }

    // Housing type filter
    if (filters.housingTypes.length > 0) {
      const hasMatchingType = filters.housingTypes.some(type => 
        zone.permittedUses.some(use => use.toLowerCase().includes(type.toLowerCase()))
      );
      if (!hasMatchingType) return false;
    }

    // Dwelling units filter (based on max density and parcel area)
    const maxUnits = Math.floor((zone.maxDensity * parcel.area) / 10000);
    if (maxUnits < filters.minDwellings || maxUnits > filters.maxDwellings) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex h-[calc(100vh-65px)]">
      <FilterSidebar filters={filters} onFiltersChange={setFilters} />
      
      <div className="flex-1 flex flex-col">
        <SearchBar onSearch={handleSearch} searchResults={searchResults} onSelectResult={(result) => {
          if (result.type === 'parcel') {
            setSelectedParcel(result.data);
            setSearchResults([]);
          }
        }} />
        
        <div className="flex-1 flex">
          <div className={`transition-all duration-300 ${selectedParcel ? 'flex-[0.6]' : 'flex-1'}`}>
            <MapView
              parcels={filteredParcels}
              selectedParcel={selectedParcel}
              onParcelClick={setSelectedParcel}
              filters={filters}
            />
          </div>
          
          {selectedParcel && (
            <div className="flex-[0.4] border-l border-slate-200 bg-white overflow-y-auto">
              <ParcelDetail
                parcel={selectedParcel}
                onClose={() => setSelectedParcel(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}