import { Download, ExternalLink, FileJson, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import type { ZoningBylaw } from '../types/zoning';

interface ZoningResultsProps {
  results: ZoningBylaw[];
  isLoading: boolean;
  onExport: (format: 'json' | 'csv') => void;
}

export function ZoningResults({ results, isLoading, onExport }: ZoningResultsProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600">Gathering zoning by-laws...</p>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Amended':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Repealed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-slate-700">
          Found {results.length} by-law{results.length !== 1 ? 's' : ''}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('json')}
            disabled={results.length === 0}
            className="flex items-center gap-2"
          >
            <FileJson className="w-4 h-4" />
            Export JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('csv')}
            disabled={results.length === 0}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {results.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-slate-500">
            <p className="mb-2">No zoning by-laws found matching your criteria.</p>
            <p className="text-sm">Try adjusting your search terms or selecting a different category.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {results.map((bylaw) => (
            <Card key={bylaw.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-slate-900">{bylaw.title}</h3>
                    <Badge className={getStatusColor(bylaw.status)} variant="outline">
                      {bylaw.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">By-law No. {bylaw.bylawNumber}</p>
                </div>
                <Badge variant="secondary">{bylaw.category}</Badge>
              </div>

              <p className="text-slate-700 mb-4">{bylaw.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Date Enacted</p>
                  <p className="text-sm">{new Date(bylaw.dateEnacted).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Last Amended</p>
                  <p className="text-sm">{new Date(bylaw.lastAmended).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-slate-500 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {bylaw.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <a
                  href={bylaw.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View full by-law
                  <ExternalLink className="w-3 h-3" />
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const dataStr = JSON.stringify(bylaw, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                    const exportFileDefaultName = `bylaw-${bylaw.bylawNumber}.json`;
                    
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
