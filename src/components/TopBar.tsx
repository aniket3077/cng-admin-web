import { Link } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';

interface TopBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showNewStationButton?: boolean;
}

export default function TopBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  showNewStationButton = false,
}: TopBarProps) {
  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        {onSearchChange && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 text-slate-800 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all duration-300 placeholder:text-slate-400"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {showNewStationButton && (
          <Link
            to="/stations/add"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>New Station</span>
          </Link>
        )}

        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
          <button className="relative p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-100 rounded-xl transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shadow-sm">
              A
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-slate-800">Admin</div>
              <div className="text-xs text-slate-500">Super User</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
