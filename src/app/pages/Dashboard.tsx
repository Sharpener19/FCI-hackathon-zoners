import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AlertCircle, TrendingUp, Building, Map } from 'lucide-react';
import { municipalities, zoneRegulations } from '../data/municipalityData';

export function Dashboard() {
  // Calculate restrictiveness by municipality
  const restrictivenessByMunicipality = municipalities.map(muni => {
    const zones = zoneRegulations.filter(z => z.municipalityId === muni.id);
    const avgScore = zones.reduce((acc, z) => acc + z.restrictionScore, 0) / zones.length;
    return {
      name: muni.name,
      score: Math.round(avgScore),
      zones: zones.length
    };
  }).sort((a, b) => b.score - a.score);

  // Restrictiveness distribution
  const restrictionLevels = {
    'Very High': zoneRegulations.filter(z => z.restrictiveness === 'Very High').length,
    'High': zoneRegulations.filter(z => z.restrictiveness === 'High').length,
    'Medium': zoneRegulations.filter(z => z.restrictiveness === 'Medium').length,
    'Low': zoneRegulations.filter(z => z.restrictiveness === 'Low').length,
  };

  const pieData = Object.entries(restrictionLevels).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#dc2626', '#f59e0b', '#3b82f6', '#10b981'];

  // Density comparison
  const densityComparison = municipalities.map(muni => {
    const zones = zoneRegulations.filter(z => z.municipalityId === muni.id);
    const maxDensityZone = zones.reduce((max, z) => z.maxDensity > max.maxDensity ? z : max);
    const avgDensity = zones.reduce((acc, z) => acc + z.maxDensity, 0) / zones.length;
    return {
      municipality: muni.name,
      maxDensity: maxDensityZone.maxDensity,
      avgDensity: Math.round(avgDensity)
    };
  });

  // Parking requirements radar
  const parkingData = municipalities.map(muni => {
    const zones = zoneRegulations.filter(z => z.municipalityId === muni.id);
    const avgParking = zones.reduce((acc, z) => acc + z.minParkingPerUnit, 0) / zones.length;
    return {
      municipality: muni.name.split(',')[0],
      parking: Number(avgParking.toFixed(2))
    };
  });

  // Key insights
  const mostRestrictive = restrictivenessByMunicipality[0];
  const leastRestrictive = restrictivenessByMunicipality[restrictivenessByMunicipality.length - 1];
  const avgRestriction = Math.round(
    restrictivenessByMunicipality.reduce((acc, m) => acc + m.score, 0) / municipalities.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-1">Dashboard Overview</h2>
        <p className="text-slate-600">
          Comparative analysis of zoning restrictions across {municipalities.length} municipalities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-red-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Most Restrictive</p>
              <h3 className="text-slate-900">{mostRestrictive.name}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-red-900">{mostRestrictive.score}</span>
            <span className="text-sm text-slate-600">/100 score</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Least Restrictive</p>
              <h3 className="text-slate-900">{leastRestrictive.name}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-green-900">{leastRestrictive.score}</span>
            <span className="text-sm text-slate-600">/100 score</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Zones Analyzed</p>
              <h3 className="text-slate-900">Regulations</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Map className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-blue-900">{zoneRegulations.length}</span>
            <span className="text-sm text-slate-600">zones</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Avg Restriction Score</p>
              <h3 className="text-slate-900">All Municipalities</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-purple-900">{avgRestriction}</span>
            <span className="text-sm text-slate-600">/100 score</span>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Restrictiveness by Municipality</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={restrictivenessByMunicipality}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#6366f1" name="Restriction Score" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-500 mt-4">
            Higher scores indicate more restrictive zoning regulations
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Restrictiveness Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-500 mt-4">
            Distribution of zone restrictiveness levels across all municipalities
          </p>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Density Allowances Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={densityComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="municipality" />
              <YAxis label={{ value: 'Units per hectare', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="maxDensity" fill="#10b981" name="Max Density" />
              <Bar dataKey="avgDensity" fill="#3b82f6" name="Avg Density" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-500 mt-4">
            Maximum and average permitted densities across municipalities
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Average Parking Requirements</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={parkingData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="municipality" />
              <PolarRadiusAxis angle={90} domain={[0, 2]} />
              <Radar name="Parking per Unit" dataKey="parking" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-500 mt-4">
            Minimum parking spaces required per residential unit
          </p>
        </Card>
      </div>

      {/* Key Findings */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Key Findings & Recommendations</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Badge className="bg-red-100 text-red-800">High Impact</Badge>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Restrictive Single-Family Zoning</h4>
              <p className="text-sm text-slate-600">
                {restrictionLevels['Very High']} zones classified as "Very High" restrictiveness, primarily single-family 
                zoning with large minimum lot sizes and low density limits. This significantly constrains housing supply.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Badge className="bg-amber-100 text-amber-800">Barrier</Badge>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Parking Requirements Increase Costs</h4>
              <p className="text-sm text-slate-600">
                High minimum parking requirements (averaging {(parkingData.reduce((acc, d) => acc + d.parking, 0) / parkingData.length).toFixed(1)} 
                spaces/unit) add approximately $25,000-$50,000 per unit in construction costs, reducing housing affordability.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Badge className="bg-green-100 text-green-800">Opportunity</Badge>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Transit-Oriented Development Potential</h4>
              <p className="text-sm text-slate-600">
                {zoneRegulations.filter(z => z.restrictiveness === 'Low').length} zones permit high-density development. 
                Expanding these designations near transit could unlock significant housing capacity.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
