import { Link } from 'react-router-dom';

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {onSearchChange ? (
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-96 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <div className="w-96" />
            )}
          </div>
          <div className="flex items-center space-x-4">
            {showNewStationButton && (
              <Link
                to="/stations/add"
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg shadow-orange-500/30"
              >
                + New Station
              </Link>
            )}
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              🔔
            </button>
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-sm text-gray-700 font-medium">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
