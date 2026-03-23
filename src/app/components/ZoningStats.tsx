import { FileText, CheckCircle, Edit3, BarChart3 } from 'lucide-react';
import { Card } from './ui/card';
import type { ZoningBylaw } from '../types/zoning';

interface ZoningStatsProps {
  data: ZoningBylaw[];
}

export function ZoningStats({ data }: ZoningStatsProps) {
  const totalBylaws = data.length;
  const activeBylaws = data.filter(b => b.status === 'Active').length;
  const amendedBylaws = data.filter(b => b.status === 'Amended').length;
  
  const categories = data.reduce((acc, bylaw) => {
    acc[bylaw.category] = (acc[bylaw.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Total By-laws</p>
            <p className="text-3xl font-semibold text-blue-900">{totalBylaws}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Active</p>
            <p className="text-3xl font-semibold text-green-900">{activeBylaws}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-amber-50 to-white border-amber-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Amended</p>
            <p className="text-3xl font-semibold text-amber-900">{amendedBylaws}</p>
          </div>
          <div className="p-3 bg-amber-100 rounded-lg">
            <Edit3 className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Categories</p>
            <p className="text-3xl font-semibold text-purple-900">{Object.keys(categories).length}</p>
            <div className="mt-2 text-xs text-slate-600">
              {topCategories.map(([cat, count], idx) => (
                <div key={cat}>
                  {cat}: {count}
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}
