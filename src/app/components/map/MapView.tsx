import { useEffect, useRef, useState } from 'react';
import type { Parcel } from '../../data/waterlooGuelphData';
import { zoneRegulations } from '../../data/waterlooGuelphData';
import type { Filters } from '../../pages/Homepage';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';

// Leaflet is loaded from CDN in index.html
declare const L: any;

interface MapViewProps {
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  onParcelClick: (parcel: Parcel) => void;
  filters: Filters;
}

export function MapView({ parcels, selectedParcel, onParcelClick, filters }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layerGroup = useRef<L.FeatureGroup | null>(null);
  const [initialized, setInitialized] = useState(false);

  const getZoneColor = (parcel: Parcel) => {
    const zone = zoneRegulations.find(z => 
      z.municipalityId === parcel.municipalityId && z.zoneCode === parcel.zoneCode
    );
    if (!zone) return '#94a3b8';

    switch (zone.restrictiveness) {
      case 'Very High': return '#ffdaff';
      case 'High': return '#e388e1';
      case 'Medium': return '#9b2cb7';
      case 'Low': return '#640877';
      default: return '#c8c8c8';
    }
  };

  // Get center of municipality based on filter
  const getMunicipalityCenter = (): [number, number] => {
    if (filters.municipality === 'waterloo') {
      return [43.4516, -80.4925];
    } else if (filters.municipality === 'guelph') {
      return [43.5433, -80.2506];
    }
    return [43.5, -80.3];
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || initialized) return;

    const center = getMunicipalityCenter();
    map.current = L.map(mapContainer.current).setView(center, 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Create feature group for parcels
    layerGroup.current = L.featureGroup().addTo(map.current);

    setInitialized(true);
  }, []);

  // Update map when parcels or municipality changes
  useEffect(() => {
    if (!map.current || !layerGroup.current) return;

    // Clear previous layers
    layerGroup.current.clearLayers();

    // Add parcel polygons
    parcels.forEach((parcel) => {
      if (!parcel.geom || parcel.geom.length === 0) return;

      const isSelected = selectedParcel?.id === parcel.id;
      const color = getZoneColor(parcel);

      // Convert geom coordinates to Leaflet format [lat, lng]
      const latlngs = parcel.geom.map(coord => [coord.lat, coord.lng] as [number, number]);

      const polygon = L.polygon(latlngs, {
        color: isSelected ? '#1e293b' : '#64748b',
        weight: isSelected ? 3 : 2,
        opacity: 1,
        fillColor: color,
        fillOpacity: 0.6,
      });

      // Add popup with parcel info
      polygon.bindPopup(`
        <div class="p-2">
          <p class="font-semibold">${parcel.address}</p>
          <p class="text-sm text-gray-600">Zone: ${parcel.zoneCode}</p>
          <p class="text-sm text-gray-600">Area: ${parcel.area} m²</p>
        </div>
      `);

      // Click handler
      polygon.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onParcelClick(parcel);
      });

      polygon.addTo(layerGroup.current);
    });

    // Fit map to parcels bounds
    if (parcels.length > 0 && parcels[0].geom && parcels[0].geom.length > 0) {
      const bounds = L.latLngBounds(
        parcels
          .filter(p => p.geom && p.geom.length > 0)
          .flatMap(p => p.geom!.map(coord => [coord.lat, coord.lng] as [number, number]))
      );
      map.current?.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [parcels, selectedParcel, onParcelClick]);

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  const handleReset = () => {
    const center = getMunicipalityCenter();
    map.current?.setView(center, 15);
  };

  return (
    <div className="w-full h-full bg-slate-100 relative flex flex-col">
      <div ref={mapContainer} className="flex-1 relative" id="map" />
      
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomIn}
          className="bg-white hover:bg-slate-100 shadow-lg"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomOut}
          className="bg-white hover:bg-slate-100 shadow-lg"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleReset}
          className="bg-white hover:bg-slate-100 shadow-lg"
          title="Reset zoom and position"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[400]">
        <p className="font-medium text-slate-900 mb-1">Click on any parcel to view details</p>
        <p className="text-slate-600 mt-1">Colors indicate zoning restrictiveness</p>
      </div>
    </div>
  );
}