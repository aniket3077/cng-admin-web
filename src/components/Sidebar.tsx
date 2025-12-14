import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
  ticketCount?: number;
}

export default function Sidebar({ onLogout, ticketCount = 0 }: SidebarProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white fixed h-full shadow-2xl z-50">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">⛽</span>
          </div>
          <span className="text-xl font-bold">Fuely</span>
        </Link>

        <div className="space-y-2">
          <div className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Main Menu</div>
          <Link
            to="/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-gray-700/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <span className="text-lg">📊</span>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/owners"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/owners')
                ? 'bg-gray-700/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <span className="text-lg">👥</span>
            <span className="font-medium">Station Owners</span>
          </Link>
          <Link
            to="/tickets"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/tickets')
                ? 'bg-gray-700/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <span className="text-lg">💬</span>
            <span className="font-medium">Support Tickets</span>
            {ticketCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {ticketCount}
              </span>
            )}
          </Link>
        </div>

        <div className="mt-8">
          <div className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Preference</div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full"
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
