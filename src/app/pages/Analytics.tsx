import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { municipalities, zoneRegulations } from '../data/municipalityData';

export function Analytics() {
  // Correlation between parking and restrictiveness
  const parkingVsRestriction = zoneRegulations.map(z => ({
    parking: z.minParkingPerUnit,
    restriction: z.restrictionScore,
    name: z.zoneCode,
    municipality: municipalities.find(m => m.id === z.municipalityId)?.name.split(',')[0]
  }));

  // Density vs Height analysis
  const densityVsHeight = zoneRegulations.map(z => ({
    density: z.maxDensity,
    height: z.maxHeight,
    name: z.zoneCode,
    restrictiveness: z.restrictiveness
  }));

  // Calculate housing potential impact
  const housingImpact = municipalities.map(muni => {
    const zones = zoneRegulations.filter(z => z.municipalityId === muni.id);
    const avgDensity = zones.reduce((acc, z) => acc + z.maxDensity, 0) / zones.length;
    const currentPotential = Math.round(avgDensity * muni.area * 0.3); // 30% of land
    
    // If restrictions reduced by 20%
    const improvedDensity = avgDensity * 1.2;
    const improvedPotential = Math.round(improvedDensity * muni.area * 0.3);
    
    return {
      municipality: muni.name,
      current: currentPotential,
      improved: improvedPotential,
      gain: improvedPotential - currentPotential
    };
  });

  // Restrictive pattern analysis
  const patterns = [
    {
      pattern: 'Large Minimum Lot Sizes',
      affected: zoneRegulations.filter(z => z.minLotSize > 500).length,
      impact: 'High',
      description: 'Zones requiring lot sizes >500m² severely limit density and increase land costs per unit.',
      recommendation: 'Reduce minimum lot sizes to 250-350m² in residential zones.'
    },
    {
      pattern: 'Excessive Parking Requirements',
      affected: zoneRegulations.filter(z => z.minParkingPerUnit >= 1.5).length,
      impact: 'High',
      description: 'Parking requirements ≥1.5 spaces/unit add $35,000-$50,000 per unit in construction costs.',
      recommendation: 'Reduce to 0.5-1.0 spaces/unit near transit, eliminate minimums in urban cores.'
    },
    {
      pattern: 'Low Height Limits',
      affected: zoneRegulations.filter(z => z.maxHeight <= 12).length,
      impact: 'Medium',
      description: 'Height limits ≤12m restrict development to 3-4 storeys, limiting achievable density.',
      recommendation: 'Increase to 18-25m near transit stations and arterial roads.'
    },
    {
      pattern: 'High Setback Requirements',
      affected: zoneRegulations.filter(z => z.minSetbackFront >= 7).length,
      impact: 'Medium',
      description: 'Large setbacks reduce buildable area and create car-oriented streetscapes.',
      recommendation: 'Reduce front setbacks to 3-5m to enable street-oriented development.'
    },
    {
      pattern: 'Limited Permitted Uses',
      affected: zoneRegulations.filter(z => z.permittedUses.length <= 2).length,
      impact: 'Medium',
      description: 'Restrictive use lists prevent mixed-use development and adaptable buildings.',
      recommendation: 'Expand permitted uses to allow mixed residential-commercial in more zones.'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-1">Restrictive Patterns Analysis</h2>
        <p className="text-slate-600">
          Identify and understand systemic barriers to housing development
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-slate-600">Very High Restriction Zones</p>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">
            {zoneRegulations.filter(z => z.restrictiveness === 'Very High').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {Math.round((zoneRegulations.filter(z => z.restrictiveness === 'Very High').length / zoneRegulations.length) * 100)}% of total
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-slate-600">Avg Min Lot Size</p>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">
            {Math.round(zoneRegulations.reduce((acc, z) => acc + z.minLotSize, 0) / zoneRegulations.length)}
          </p>
          <p className="text-xs text-slate-500 mt-1">m² across all zones</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-slate-600">Avg Parking Requirement</p>
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">
            {(zoneRegulations.reduce((acc, z) => acc + z.minParkingPerUnit, 0) / zoneRegulations.length).toFixed(1)}
          </p>
          <p className="text-xs text-slate-500 mt-1">spaces per unit</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-slate-600">Low Restriction Zones</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">
            {zoneRegulations.filter(z => z.restrictiveness === 'Low').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {Math.round((zoneRegulations.filter(z => z.restrictiveness === 'Low').length / zoneRegulations.length) * 100)}% of total
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Parking Requirements vs Restrictiveness</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="parking" name="Parking per Unit" />
              <YAxis dataKey="restriction" name="Restriction Score" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Zones" data={parkingVsRestriction} fill="#6366f1" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-500 mt-4">
            Strong positive correlation: higher parking requirements coincide with higher restrictiveness
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Density vs Height Allowances</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="density" name="Max Density (u/ha)" />
              <YAxis dataKey="height" name="Max Height (m)" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Zones" data={densityVsHeight} fill="#10b981" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-500 mt-4">
            Higher density zones generally permit greater heights, enabling vertical development
          </p>
        </Card>
      </div>

      {/* Housing Potential Impact */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Housing Potential: Impact of Reducing Restrictions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={housingImpact}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="municipality" />
            <YAxis label={{ value: 'Potential Units (thousands)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" fill="#94a3b8" name="Current Potential" />
            <Bar dataKey="improved" fill="#10b981" name="With 20% Less Restriction" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-900">
            <strong>Estimated Impact:</strong> Reducing zoning restrictions by 20% could unlock approximately{' '}
            <strong>{housingImpact.reduce((acc, h) => acc + h.gain, 0).toLocaleString()}</strong> additional housing units 
            across these municipalities.
          </p>
        </div>
      </Card>

      {/* Restrictive Patterns */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Identified Restrictive Patterns</h3>
        <div className="space-y-4">
          {patterns.map((pattern, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-slate-900">{pattern.pattern}</h4>
                    <Badge className={getImpactColor(pattern.impact)} variant="outline">
                      {pattern.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{pattern.description}</p>
                </div>
                <div className="text-center ml-4">
                  <p className="text-2xl font-semibold text-slate-900">{pattern.affected}</p>
                  <p className="text-xs text-slate-500">zones affected</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-900">
                  <strong>Recommendation:</strong> {pattern.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Insights */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
        <h3 className="text-slate-900 mb-4">Key Planning Insights</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-1.5"></div>
            <p className="text-slate-700">
              <strong>Single-family zoning dominates:</strong> {zoneRegulations.filter(z => z.restrictiveness === 'Very High').length} zones 
              are classified as "Very High" restrictiveness, primarily single-family zones with large lots and low density.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-1.5"></div>
            <p className="text-slate-700">
              <strong>Parking is a major cost driver:</strong> Zones requiring 1.5+ parking spaces add $35,000-$50,000 per unit, 
              significantly impacting affordability in {zoneRegulations.filter(z => z.minParkingPerUnit >= 1.5).length} zones.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-1.5"></div>
            <p className="text-slate-700">
              <strong>Missing middle housing constrained:</strong> Medium-density zones are under-represented, creating a gap 
              between single-family and high-rise development options.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-1.5"></div>
            <p className="text-slate-700">
              <strong>Reform opportunity:</strong> Modest zoning reforms (reducing lot sizes, parking, setbacks) could unlock 
              significant housing capacity without requiring high-rise development.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
