import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, Zap, BatteryCharging, User, LayoutDashboard, PlusCircle, CreditCard, ChevronRight, MapPin, CheckCircle, AlertCircle, TrendingUp, Shield, BarChart3, Edit2, X, Loader } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  city?: string;
  state?: string;
  approvalStatus: string;
  cngAvailable?: boolean;
  cngQuantityKg?: number;
  cngUpdatedAt?: string;
}

interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  onboardingStep: number;
  profileComplete: boolean;
  subscriptionType?: string;
  subscriptionEndsAt?: string;
  stations?: Station[];
}

interface SubscriptionStatus {
  plan: string;
  isActive: boolean;
  expiresAt: string | null;
}

export default function OwnerDashboard() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [cngQuantity, setCngQuantity] = useState<{ [key: string]: number }>({});
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>('');
  const [updatingCng, setUpdatingCng] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = 'https://api.cngbharat.com/api';

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('ownerToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/owner/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Fetch subscription error:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('ownerToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/owner/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOwner(data.owner);
        localStorage.setItem('ownerUser', JSON.stringify(data.owner));

        // Set CNG status and quantity for all stations
        const statusMap: { [key: string]: boolean } = {};
        const quantityMap: { [key: string]: number } = {};
        data.owner.stations?.forEach((station: Station) => {
          statusMap[station.id] = station.cngAvailable ?? true;
          quantityMap[station.id] = station.cngQuantityKg ?? 0;
        });
        setCngQuantity(quantityMap);
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  };

  useEffect(() => {
    const ownerData = localStorage.getItem('ownerUser');
    if (!ownerData) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(ownerData);
    setOwner(parsed);

    // Initialize CNG status and quantity
    const quantityMap: { [key: string]: number } = {};
    parsed.stations?.forEach((station: Station) => {
      quantityMap[station.id] = station.cngQuantityKg ?? 0;
    });
    setCngQuantity(quantityMap);

    // Fetch fresh data
    fetchProfile();
    fetchSubscription();
  }, [navigate]);

  const handleQuantityUpdate = async (stationId: string, quantity: number) => {
    setUpdatingCng(stationId);
    try {
      const token = localStorage.getItem('ownerToken');

      const response = await fetch(`${API_URL}/owner/cng-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stationId,
          cngQuantityKg: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update CNG quantity');
      }

      const newAvailable = quantity > 0;
      setCngQuantity(prev => ({
        ...prev,
        [stationId]: quantity,
      }));

      setOwner((prev: Owner | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          stations: prev.stations?.map((s: Station) =>
            s.id === stationId
              ? { ...s, cngAvailable: newAvailable, cngQuantityKg: quantity, cngUpdatedAt: new Date().toISOString() }
              : s
          ),
        };
      });

      setEditingQuantity(null);
      setTempQuantity('');

    } catch (error) {
      console.error('CNG quantity update error:', error);
      alert('Failed to update CNG quantity');
    } finally {
      setUpdatingCng(null);
    }
  };


  const formatLastUpdated = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (!owner) return null;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {owner.name}!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-600 shadow-sm">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Subscription Banner */}
      {subscription && subscription.isActive ? (
        <div className="relative overflow-hidden rounded-2xl glass-card border border-primary-200 p-8 shadow-xl shadow-primary-500/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  Active Subscription • {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                </h2>
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-500" />
                  {subscription.expiresAt && (() => {
                    const daysLeft = Math.ceil((new Date(subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return daysLeft > 0
                      ? `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`
                      : 'Expired - Please renew';
                  })()}
                </p>
              </div>
            </div>
            <Link to="/owner/subscription" className="px-6 py-3 bg-white text-primary-600 border border-primary-100 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-sm">
              Manage Plan
            </Link>
          </div>
        </div>
      ) : (
        <Link to="/owner/subscription" className="block group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Boost Your Visibility! 🚀</h2>
                  <p className="text-white/80 text-sm">Subscribe now to get listed on CNG Bharat and reach thousands of customers.</p>
                </div>
              </div>
              <div className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold group-hover:bg-slate-100 transition-colors flex items-center gap-2">
                View Plans <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Stations */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl translate-x-10 -translate-y-10 group-hover:bg-blue-100/80 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-600">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <span className="text-slate-500 font-medium">My Stations</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-800">{owner.stations?.length || 0}</span>
              <Link to="/owner/add-station" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                + Add New
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Status */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl translate-x-10 -translate-y-10 group-hover:bg-emerald-100/80 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                <User className="w-6 h-6" />
              </div>
              <span className="text-slate-500 font-medium">Profile Status</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-lg font-bold text-slate-800">{owner.profileComplete ? 'Complete' : 'Incomplete'}</span>
              {owner.profileComplete ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
          </div>
        </div>

        {/* Onboarding */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-purple-100/50 rounded-full blur-2xl translate-x-10 -translate-y-10 group-hover:bg-purple-100/80 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-purple-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-slate-500 font-medium">Onboarding</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-800">{owner.onboardingStep}/3</span>
              <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${(owner.onboardingStep / 3) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stations List */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-500" /> My Stations
            </h2>
            <Link to="/owner/add-station" className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-primary-600 transition-colors">
              <PlusCircle className="w-5 h-5" />
            </Link>
          </div>

          {owner.stations && owner.stations.length > 0 ? (
            <div className="space-y-4">
              {owner.stations.map((station) => (
                <div key={station.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-200 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{station.name}</p>
                      <p className="text-xs text-slate-500">{station.city || 'No Location'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${station.approvalStatus === 'approved'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : station.approvalStatus === 'rejected'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                    {station.approvalStatus}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No stations registered yet</p>
              <Link to="/owner/add-station" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                Register your first station
              </Link>
            </div>
          )}
        </div>

        {/* CNG Updates */}
        <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-emerald-500" /> CNG Stock
            </h2>
            <Link to="/owner/profile" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">View All</Link>
          </div>

          {owner.stations && owner.stations.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {owner.stations.slice(0, 3).map((station) => (
                <div key={station.id} className={`p-4 rounded-xl border transition-all ${cngQuantity[station.id] > 0
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-red-50 border-red-100'
                  }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-slate-800">{station.name}</p>
                      <p className="text-xs text-slate-500">{formatLastUpdated(station.cngUpdatedAt)}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${cngQuantity[station.id] > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  </div>

                  <div className="flex gap-2">
                    {editingQuantity === station.id ? (
                      <div className="flex gap-2 w-full">
                        <input
                          id={`cngQuantity-${station.id}`}
                          name={`cngQuantity-${station.id}`}
                          type="number"
                          value={tempQuantity}
                          onChange={(e) => setTempQuantity(e.target.value)}
                          className="flex-1 bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-1 text-sm text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                          autoFocus
                          aria-label="CNG Quantity"
                        />
                        <button
                          onClick={() => handleQuantityUpdate(station.id, parseFloat(tempQuantity) || 0)}
                          disabled={updatingCng === station.id}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg shadow-sm"
                          aria-label="Update Quantity"
                        >
                          {updatingCng === station.id ? <Loader className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingQuantity(null)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-600 p-1.5 rounded-lg"
                          aria-label="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingQuantity(station.id);
                          setTempQuantity((cngQuantity[station.id] || 0).toString());
                        }}
                        className="w-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg py-2 flex items-center justify-center gap-2 transition-all group shadow-sm"
                      >
                        <span className="font-bold text-slate-700 group-hover:text-emerald-600">{cngQuantity[station.id] || 0} kg</span>
                        <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <BatteryCharging className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No stations to manage</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/owner/add-station" className="p-4 bg-white/60 hover:bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Add Station</span>
          </Link>
          <Link to="/owner/subscription" className="p-4 bg-white/60 hover:bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Subscription</span>
          </Link>
          <Link to="/owner/profile" className="p-4 bg-white/60 hover:bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Profile</span>
          </Link>
          <Link to="/owner/profile" className="p-4 bg-white/60 hover:bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 transition-all hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-600 group-hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
