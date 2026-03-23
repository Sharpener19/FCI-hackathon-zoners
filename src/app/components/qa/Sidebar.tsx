import { Home, Tag, TrendingUp, Users, HelpCircle } from 'lucide-react';
import { Card } from '../ui/card';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const categories = [
    { id: 'all', label: 'All Questions', icon: Home, count: null },
    { id: 'javascript', label: 'JavaScript', icon: Tag, count: 42 },
    { id: 'react', label: 'React', icon: Tag, count: 28 },
    { id: 'css', label: 'CSS', icon: Tag, count: 19 },
    { id: 'nodejs', label: 'Node.js', icon: Tag, count: 15 },
    { id: 'security', label: 'Security', icon: Tag, count: 12 },
  ];

  const quickLinks = [
    { label: 'Trending', icon: TrendingUp },
    { label: 'Unanswered', icon: HelpCircle },
    { label: 'Users', icon: Users },
  ];

  return (
    <aside className="w-64 p-6 border-r border-slate-200 bg-white min-h-screen">
      <nav className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.label}</span>
              </div>
              {category.count !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {category.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <Card className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <h3 className="text-sm font-medium text-slate-900 mb-2">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Questions</span>
            <span className="font-medium text-slate-900">2,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Answers</span>
            <span className="font-medium text-slate-900">5,692</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Users</span>
            <span className="font-medium text-slate-900">1,234</span>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <h3 className="text-xs font-medium text-slate-500 uppercase mb-2 px-3">Quick Links</h3>
        <nav className="space-y-1">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
