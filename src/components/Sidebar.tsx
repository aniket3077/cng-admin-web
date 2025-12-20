import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const userType = localStorage.getItem('userType');
  const isOwner = userType === 'owner';
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Owner Sidebar
  if (isOwner) {
    return (
      <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white fixed h-full shadow-2xl z-50">
        <div className="p-6">
          <Link to="/owner/dashboard" className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">⛽</span>
            </div>
            <span className="text-xl font-bold">CNG Bharat</span>
          </Link>

          <div className="space-y-2">
            <div className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Main Menu</div>
            <Link
              to="/owner/dashboard"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/owner/dashboard')
                  ? 'bg-gray-700/50 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              <span className="text-lg">📊</span>
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              to="/owner/add-station"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/owner/add-station')
                  ? 'bg-gray-700/50 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              <span className="text-lg">➕</span>
              <span className="font-medium">Add Station</span>
            </Link>
            <Link
              to="/owner/profile"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/owner/profile')
                  ? 'bg-gray-700/50 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              <span className="text-lg">👤</span>
              <span className="font-medium">Profile & CNG Status</span>
            </Link>
            <Link
              to="/owner/subscription"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/owner/subscription')
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/10'
              }`}
            >
              <span className="text-lg">⭐</span>
              <span className="font-medium">Subscription</span>
            </Link>
          </div>

          <div className="mt-8">
            <div className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Account</div>
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

  // Admin Sidebar
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white fixed h-full shadow-2xl z-50">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">⛽</span>
          </div>
          <div>
            <span className="text-xl font-bold block">CNG Bharat</span>
            <span className="text-xs text-gray-400">Admin Panel</span>
          </div>
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
            to="/stations"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/stations')
                ? 'bg-gray-700/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <span className="text-lg">⛽</span>
            <span className="font-medium">Stations</span>
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
            to="/subscriptions"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/subscriptions')
                ? 'bg-gray-700/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <span className="text-lg">💳</span>
            <span className="font-medium">Subscriptions</span>
          </Link>
        </div>

        <div className="mt-8">
          <div className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Settings</div>
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
