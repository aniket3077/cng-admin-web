import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const [userType, setUserType] = useState<'admin' | 'subscriber'>('admin');
  
  useEffect(() => {
    const type = localStorage.getItem('userType') as 'admin' | 'subscriber' || 'admin';
    setUserType(type);
    
    // Listen for storage changes
    const handleStorageChange = () => {
      const newType = localStorage.getItem('userType') as 'admin' | 'subscriber' || 'admin';
      setUserType(newType);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-sky-600 to-sky-700 text-white fixed h-full shadow-2xl z-50 flex flex-col">
      <div className="p-4 flex-shrink-0">
        <Link to="/dashboard" className="flex flex-col items-center space-y-2">
          <img 
            src="/WhatsApp%20Image%202025-12-10%20at%2016.41.29_8d5288d7.jpg" 
            alt="CNG Bharat Logo" 
            className="w-24 h-24 object-contain"
          />
          <div className="text-center">
            <span className="text-xl font-black tracking-wide">CNG BHARAT</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="space-y-1">
          <div className="text-xs uppercase text-sky-200 font-semibold mb-3 px-3 mt-2">Main Menu</div>
          
          <Link
            to="/dashboard"
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
              isActive('/dashboard')
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-sky-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          {userType === 'subscriber' && (
            <>
            <Link
              to="/cng-availability"
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                isActive('/cng-availability')
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-sky-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-medium text-sm">CNG Availability</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                isActive('/profile')
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-sky-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium text-sm">Profile</span>
            </Link>
            </>
          )}

          {userType === 'admin' && (
            <>
              <Link
                to="/subscribers"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/subscribers')
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium text-sm">Subscriber Management</span>
              </Link>

              <Link
                to="/owners"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/owners')
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium text-sm">Station Owners</span>
              </Link>

              <Link
                to="/support"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/support')
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium text-sm">Support Tickets</span>
              </Link>

              <Link
                to="/add"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/add')
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium text-sm">Add Station</span>
              </Link>

              <Link
                to="/subscriptions"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/subscriptions')
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium text-sm">Subscription Management</span>
              </Link>

              <Link
                to="/revenue"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive('/revenue')
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-sm">Revenue Report</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-sky-500/30 flex-shrink-0">
        {/* User Type Indicator */}
        <div className="mb-3 px-3 py-2 bg-white/10 rounded-lg">
          <p className="text-xs text-sky-200 mb-1">Logged in as:</p>
          <p className="text-sm font-bold text-white capitalize">{userType}</p>
        </div>
        
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 px-4 py-2.5 text-sky-100 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium text-sm">Log Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
