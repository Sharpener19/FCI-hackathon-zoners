import { MessageSquare, Search, PlusCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface HeaderProps {
  onAskQuestion: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Header({ onAskQuestion, searchTerm, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">Q&A Community</h1>
              <p className="text-xs text-slate-500">Ask questions, share knowledge</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={onAskQuestion} className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Ask Question
          </Button>
        </div>
      </div>
    </header>
  );
}
