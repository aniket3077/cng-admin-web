import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { Users, ShoppingBag, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 7320,
    totalOrders: 19320,
    totalSales: 20320,
    totalPending: 7320,
    stations: 0,
    owners: 0,
    tickets: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await adminApi.getStations(1);
      setStats(prev => ({ ...prev, stations: data.total || 0 }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color.replace('text-', 'bg-').replace('500', '100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real-time insights and performance metrics.</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm">
          <select id="timePeriod" name="timePeriod" aria-label="Time period" className="bg-transparent border-none text-slate-600 focus:ring-0 text-sm cursor-pointer font-medium">
            <option className="bg-white text-slate-800">This Month</option>
            <option className="bg-white text-slate-800">Last Month</option>
            <option className="bg-white text-slate-800">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="bg-blue-500 text-blue-500"
          trend="+12.5% vs last month"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          color="bg-emerald-500 text-emerald-500"
          trend="+8.2% vs last month"
        />
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-violet-500 text-violet-500"
          trend="+15.3% vs last month"
        />
        <StatCard
          title="Pending Requests"
          value={stats.totalPending.toLocaleString()}
          icon={Clock}
          color="bg-amber-500 text-amber-500"
          trend="-2.1% vs last month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/60 bg-white/50 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Analytics</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div
                  className="bg-primary-500/20 group-hover:bg-primary-500 rounded-t-lg transition-all duration-300 relative overflow-hidden"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-primary-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium uppercase tracking-wider">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* Action Required */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 bg-white/50 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Alerts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
                <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">High Pressure Alert</h4>
                  <p className="text-xs text-slate-500 mt-1">Station #123 reported abnormal pressure levels.</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">2 mins ago</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-slate-800/20">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
