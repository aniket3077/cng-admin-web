import { useState, useEffect } from 'react';
import { adminApi, Station, SupportTicket } from '../services/api';
import { Users, Fuel, Clock, MessageSquare, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStations: 0,
    totalOwners: 0,
    pendingStations: 0,
    openTickets: 0
  });

  const [recentStations, setRecentStations] = useState<Station[]>([]);
  const [recentTickets, setRecentTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    // Helper to catch errors validation
    const fetchData = async () => {
      try {
        // Fetch individually to isolate errors
        let stationsRes: any = { total: 0, stations: [] };
        try {
          stationsRes = await adminApi.getStations(1, '', undefined, '');
        } catch (e) {
          console.error('Error fetching stations:', e);
        }

        let ownersRes: any = { pagination: { total: 0 } };
        try {
          ownersRes = await adminApi.getOwners(1, 1);
        } catch (e) {
          console.error('Error fetching owners:', e);
        }

        let pendingRes: any = { total: 0 };
        try {
          pendingRes = await adminApi.getStations(1, '', undefined, 'pending');
        } catch (e) {
          console.error('Error fetching pending stations:', e);
        }

        let ticketsRes: any = { pagination: { total: 0 }, tickets: [] };
        try {
          ticketsRes = await adminApi.getTickets(1, { status: 'open' });
        } catch (e) {
          console.error('Error fetching tickets:', e);
        }

        setStats({
          totalStations: stationsRes?.total || 0,
          totalOwners: ownersRes?.pagination?.total || 0,
          pendingStations: pendingRes?.total || 0,
          openTickets: ticketsRes?.pagination?.total || 0
        });

        // Set recent data with safety checks
        setRecentStations(Array.isArray(stationsRes?.stations) ? stationsRes.stations.slice(0, 5) : []);
        setRecentTickets(Array.isArray(ticketsRes?.tickets) ? ticketsRes.tickets.slice(0, 5) : []);

      } catch (error) {
        console.error('Critical dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick }: any) => (
    <div
      onClick={onClick}
      className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color.replace('text-', 'bg-').replace('500', '100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1">{loading ? '...' : value}</h3>
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
        <div className="flex gap-2">
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Stations"
          value={stats.totalStations.toLocaleString()}
          icon={Fuel}
          color="bg-blue-500 text-blue-500"
          onClick={() => navigate('/stations')}
        />
        <StatCard
          title="Station Owners"
          value={stats.totalOwners.toLocaleString()}
          icon={Users}
          color="bg-violet-500 text-violet-500"
          onClick={() => navigate('/owners')}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingStations.toLocaleString()}
          icon={Clock}
          color="bg-amber-500 text-amber-500"
          onClick={() => navigate('/stations?status=pending')}
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets.toLocaleString()}
          icon={MessageSquare}
          color="bg-emerald-500 text-emerald-500"
          onClick={() => navigate('/support')}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Stations */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 bg-white/50 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Stations</h3>
            <button onClick={() => navigate('/stations')} className="text-sm text-primary-600 font-medium hover:text-primary-700">View All</button>
          </div>

          <div className="space-y-4 flex-1 overflow-auto">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading stations...</div>
            ) : recentStations.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No stations found.</div>
            ) : (
              recentStations.map((station) => (
                <div key={station.id} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${station.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                    station.approvalStatus === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{station.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{station.city}, {station.state}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${station.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    station.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                    {station.approvalStatus || 'Pending'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 bg-white/50 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Support Tickets</h3>
            <button onClick={() => navigate('/support')} className="text-sm text-primary-600 font-medium hover:text-primary-700">View All</button>
          </div>

          <div className="space-y-4 flex-1 overflow-auto">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading tickets...</div>
            ) : recentTickets.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No open tickets.</div>
            ) : (
              recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start gap-4 p-3 rounded-xl bg-white border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{ticket.subject}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{ticket.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
