import { X, Scale, Download, MapPin, Ruler, Home } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import type { Parcel } from '../../data/waterlooGuelphData';
import { zoneRegulations, municipalities } from '../../data/waterlooGuelphData';

interface ParcelDetailProps {
  parcel: Parcel;
  onClose: () => void;
}

export function ParcelDetail({ parcel, onClose }: ParcelDetailProps) {
  const zone = zoneRegulations.find(z => 
    z.municipalityId === parcel.municipalityId && z.zoneCode === parcel.zoneCode
  );

  const municipality = municipalities.find(m => m.id === parcel.municipalityId);

  const maxUnitsAllowed = zone 
    ? Math.floor((zone.maxDensity * parcel.area) / 10000)
    : 0;

  const getRestrictionColor = (level?: string) => {
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

  const handleExport = () => {
    const data = {
      parcel: {
        address: parcel.address,
        municipality: municipality?.name,
        zoneCode: parcel.zoneCode,
        area: parcel.area,
        frontage: parcel.frontage,
        depth: parcel.depth,
      },
      zoning: zone
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `parcel-${parcel.id}-data.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-slate-900">Parcel Details</h3>
          </div>
          <p className="text-sm text-slate-600">{parcel.address}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Parcel Summary */}
      <div className="mb-6">
        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
          <Ruler className="w-4 h-4 text-purple-600" />
          Parcel Summary
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Municipality</p>
            <p className="font-medium text-slate-900">{municipality?.name}</p>
          </div>
          <div>
            <p className="text-slate-500">Zone Code</p>
            <Badge variant="outline">{parcel.zoneCode}</Badge>
          </div>
          <div>
            <p className="text-slate-500">Area</p>
            <p className="font-medium text-slate-900">{parcel.area} m²</p>
          </div>
          <div>
            <p className="text-slate-500">Frontage</p>
            <p className="font-medium text-slate-900">{parcel.frontage} m</p>
          </div>
          <div>
            <p className="text-slate-500">Depth</p>
            <p className="font-medium text-slate-900">{parcel.depth} m</p>
          </div>
          {parcel.currentUse && (
            <div>
              <p className="text-slate-500">Current Use</p>
              <p className="font-medium text-slate-900">{parcel.currentUse}</p>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Zoning Metrics */}
      {zone && (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                <Home className="w-4 h-4 text-purple-600" />
                Zoning Metrics
              </h4>
              {/* <Badge className={getRestrictionColor(zone.restrictiveness)} variant="outline"> */}
                {/* {zone.restrictiveness} */}
              {/* </Badge> */}
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="bg-slate-50 rounded p-3">
                <p className="text-slate-600 mb-1">Zone Name</p>
                <p className="font-medium text-slate-900">{zone.zoneName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded p-2">
                  <p className="text-xs text-slate-500">Min Lot Size</p>
                  <p className="font-medium text-slate-900">{zone.minLotSize} m²</p>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <p className="text-xs text-slate-500">Max Height</p>
                  <p className="font-medium text-slate-900">{zone.maxHeight} m</p>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <p className="text-xs text-slate-500">Units Allowed</p>
                  <p className="font-medium text-slate-900">~{maxUnitsAllowed}</p>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <p className="text-xs text-slate-500">Parking Req'd</p>
                  <p className="font-medium text-slate-900">{zone.minParkingPerUnit}/unit</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded p-3">
                <p className="text-slate-600 mb-1 text-xs">Setbacks (Front / Side / Rear)</p>
                <p className="font-medium text-slate-900">
                  {zone.minSetbackFront}m / {zone.minSetbackSide}m / {zone.minSetbackRear}m
                </p>
              </div>

              <div>
                <p className="text-slate-600 mb-2 text-xs">Permitted Housing Types</p>
                <div className="flex flex-wrap gap-1">
                  {zone.permittedUses.map((use, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />
        </>
      )}

      {/* Actions */}
      {/* <div className="space-y-2">
        <h4 className="font-medium text-slate-900 mb-3">Actions</h4>
        
        <Link to="/compare" state={{ parcel }}>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Scale className="w-4 h-4 mr-2" />
            Compare with Other City
          </Button>
        </Link>

        <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div> */}
    </div>
  );
}