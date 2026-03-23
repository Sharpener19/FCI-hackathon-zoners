import { Outlet, Link, useLocation } from 'react-router';
import { Home, Scale, FileText, Building2 } from 'lucide-react';
import { CiAvocado, CiBacon } from "react-icons/ci";
import { FaHouseDamage } from "react-icons/fa";
import { PiBuildingsFill, PiBoulesFill, PiClipboardTextFill, PiMagnifyingGlassLight } from "react-icons/pi";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: PiBoulesFill },
    // { path: '/compare', label: 'Compare Cities', icon: PiBuildingsFill },
    { path: '/ocr', label: 'Document Upload', icon: PiClipboardTextFill },
    { path: '/ask', label: 'Search', icon: PiMagnifyingGlassLight },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-lightpurple-600 p-2 rounded-lg">
                <FaHouseDamage className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">ZONERS</h1>
                <p className="text-xs text-slate-500"></p>
              </div>
            </div>

            <nav className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                                (item.path !== '/' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                      isActive
                        ? 'bg-purple-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
