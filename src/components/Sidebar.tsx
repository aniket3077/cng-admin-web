import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  CreditCard,
  PlusCircle,
  User,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const isOwnerRoute = location.pathname.startsWith('/owner/');

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(to)
        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
        }`}
    >
      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive(to) ? 'fill-current' : ''}`} />
      <span className="font-medium tracking-wide">{label}</span>
      {isActive(to) && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
      )}
    </Link>
  );

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-xl shadow-slate-200/50">
      {/* Brand */}
      <div className="p-8">
        <Link to={isOwnerRoute ? "/owner/dashboard" : "/dashboard"} className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl object-contain shadow-md bg-white" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">CNG Bharat</h1>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              {isOwnerRoute ? 'Station Partner' : 'Admin Console'}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overview
          </span>
        </div>

        {isOwnerRoute ? (
          <>
            <NavItem to="/owner/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/owner/add-station" icon={PlusCircle} label="Add Station" />
            <NavItem to="/owner/profile" icon={User} label="Profile" />
            <NavItem to="/owner/subscription" icon={CreditCard} label="Subscription" />
          </>
        ) : (
          <>
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/stations" icon={MapPin} label="Stations" />
            <NavItem to="/owners" icon={Users} label="Owners" />
            <NavItem to="/subscriptions" icon={CreditCard} label="Subscriptions" />
          </>
        )}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
