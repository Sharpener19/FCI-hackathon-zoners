import { useState } from 'react';
import { useLocation } from 'react-router';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { municipalities, zoneRegulations } from '../data/waterlooGuelphData';
import type { Parcel } from '../data/waterlooGuelphData';

export function Compare() {
  const location = useLocation();
  const selectedParcel = location.state?.parcel as Parcel | undefined;

  // Get zones for comparison
  const waterlooZone = selectedParcel?.municipalityId === 'waterloo'
    ? zoneRegulations.find(z => z.municipalityId === 'waterloo' && z.zoneCode === selectedParcel.zoneCode)
    : null;

  const guelphZone = selectedParcel?.municipalityId === 'guelph'
    ? zoneRegulations.find(z => z.municipalityId === 'guelph' && z.zoneCode === selectedParcel.zoneCode)
    : null;

  // If no specific parcel selected, compare equivalent zones
  const [compareZoneType, setCompareZoneType] = useState<'low' | 'medium' | 'high'>('low');

  const getEquivalentZones = (type: 'low' | 'medium' | 'high') => {
    const zoneMap = {
      low: { waterloo: 'R1', guelph: 'R.1' },
      medium: { waterloo: 'R2', guelph: 'R.2' },
      high: { waterloo: 'R3', guelph: 'R.3' }
    };

    return {
      waterloo: zoneRegulations.find(z => z.municipalityId === 'waterloo' && z.zoneCode === zoneMap[type].waterloo),
      guelph: zoneRegulations.find(z => z.municipalityId === 'guelph' && z.zoneCode === zoneMap[type].guelph)
    };
  };

  const zones = selectedParcel 
    ? { waterloo: waterlooZone || getEquivalentZones('low').waterloo, guelph: guelphZone || getEquivalentZones('low').guelph }
    : getEquivalentZones(compareZoneType);

  const metrics = [
    { key: 'maxDensity', label: 'Max Density', unit: 'units/ha', higher: 'better' },
    { key: 'maxHeight', label: 'Max Height', unit: 'm', higher: 'better' },
    { key: 'minLotSize', label: 'Min Lot Size', unit: 'm²', higher: 'worse' },
    { key: 'maxLotCoverage', label: 'Max Lot Coverage', unit: '%', higher: 'better' },
    { key: 'minParkingPerUnit', label: 'Min Parking/Unit', unit: 'spaces', higher: 'worse' },
    { key: 'minGreenSpace', label: 'Min Green Space', unit: '%', higher: 'better' },
    { key: 'minSetbackFront', label: 'Front Setback', unit: 'm', higher: 'worse' },
  ];

  const compareValue = (key: string, val1: any, val2: any, higherBetter: string) => {
    if (val1 === val2) return 'equal';
    if (higherBetter === 'better') {
      return val1 > val2 ? 'waterloo' : 'guelph';
    } else {
      return val1 < val2 ? 'waterloo' : 'guelph';
    }
  };

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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {!selectedParcel && (
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Select Zone Type to Compare</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setCompareZoneType('low')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                compareZoneType === 'low'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Low Density (R1 / R.1)
            </button>
            <button
              onClick={() => setCompareZoneType('medium')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                compareZoneType === 'medium'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Medium Density (R2 / R.2)
            </button>
            <button
              onClick={() => setCompareZoneType('high')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                compareZoneType === 'high'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              High Density (R3 / R.3)
            </button>
          </div>
        </Card>
      )}

      {/* Detailed Comparison */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Detailed Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-slate-700">Metric</th>
                <th className="text-center py-3 px-4 text-slate-700">Waterloo</th>
                <th className="text-center py-3 px-4 text-slate-700">Guelph</th>
                <th className="text-center py-3 px-4 text-slate-700">More Favorable</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => {
                if (!zones.waterloo || !zones.guelph) return null;
                const val1 = zones.waterloo[metric.key as keyof typeof zones.waterloo];
                const val2 = zones.guelph[metric.key as keyof typeof zones.guelph];
                const comparison = compareValue(metric.key, val1, val2, metric.higher);

                return (
                  <tr key={metric.key} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{metric.label}</td>
                    <td className={`text-center py-3 px-4 ${comparison === 'waterloo' ? 'bg-green-50 font-semibold text-green-900' : ''}`}>
                      {val1} {metric.unit}
                    </td>
                    <td className={`text-center py-3 px-4 ${comparison === 'guelph' ? 'bg-green-50 font-semibold text-green-900' : ''}`}>
                      {val2} {metric.unit}
                    </td>
                    <td className="text-center py-3 px-4">
                      {comparison === 'equal' ? (
                        <span className="text-slate-500 text-sm">Equal</span>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">
                            {comparison === 'waterloo' ? 'Waterloo' : 'Guelph'}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Permitted Uses Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Waterloo - Permitted Uses</h3>
          {zones.waterloo && (
            <div className="flex flex-wrap gap-2">
              {zones.waterloo.permittedUses.map((use, idx) => (
                <Badge key={idx} variant="secondary">
                  {use}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Guelph - Permitted Uses</h3>
          {zones.guelph && (
            <div className="flex flex-wrap gap-2">
              {zones.guelph.permittedUses.map((use, idx) => (
                <Badge key={idx} variant="secondary">
                  {use}
                </Badge>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}