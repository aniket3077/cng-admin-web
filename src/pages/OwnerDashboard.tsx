import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
  const [cngQuantity, setCngQuantity] = useState<{[key: string]: number}>({});
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>('');
  const [updatingCng, setUpdatingCng] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://cng-backend.vercel.app/api';

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
        const statusMap: {[key: string]: boolean} = {};
        const quantityMap: {[key: string]: number} = {};
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
    const quantityMap: {[key: string]: number} = {};
    parsed.stations?.forEach((station: Station) => {
      quantityMap[station.id] = station.cngQuantityKg ?? 0;
    });
    setCngQuantity(quantityMap);

    // Fetch fresh data
    fetchProfile();
    fetchSubscription();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerUser');
    localStorage.removeItem('userType');
    navigate('/login');
  };

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

      // Update local state
      const newAvailable = quantity > 0;
      setCngQuantity(prev => ({
        ...prev,
        [stationId]: quantity,
      }));

      // Update owner data
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">CNG Bharat</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {owner.name}! 👋</h1>
          <p className="opacity-90">Manage your CNG stations and track performance.</p>
        </div>

        {/* Subscription Banner */}
        {subscription && subscription.isActive ? (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">✨ Active Subscription - {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan</h2>
                  <p className="opacity-90">
                    {subscription.expiresAt && (() => {
                      const daysLeft = Math.ceil((new Date(subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return daysLeft > 0 
                        ? `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} (${new Date(subscription.expiresAt).toLocaleDateString()})`
                        : 'Expired - Please renew';
                    })()}
                  </p>
                </div>
              </div>
              <Link to="/owner/subscription" className="hidden md:flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Manage Plan
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <Link to="/owner/subscription" className="block mb-8">
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">🚀 Boost Your Station Visibility!</h2>
                    <p className="opacity-90">Subscribe now to get listed on CNG Bharat app and reach thousands of customers</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                  View Plans
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">My Stations</p>
                <p className="text-2xl font-bold text-gray-900">{owner.stations?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Profile Status</p>
                <p className="text-2xl font-bold text-gray-900">{owner.profileComplete ? 'Complete' : 'Incomplete'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Onboarding Step</p>
                <p className="text-2xl font-bold text-gray-900">{owner.onboardingStep}/3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Owner Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{owner.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{owner.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{owner.phone}</p>
                </div>
              </div>
              {owner.companyName && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">{owner.companyName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Stations</h2>
            {owner.stations && owner.stations.length > 0 ? (
              <div className="space-y-3">
                {owner.stations.map((station) => (
                  <div key={station.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{station.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      station.approvalStatus === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : station.approvalStatus === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {station.approvalStatus}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p>No stations registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* CNG Availability Section - NEW */}
        {owner.stations && owner.stations.length > 0 && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⛽</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">CNG Availability (kg)</h2>
                    <p className="text-white/80 text-sm">Update daily stock to help drivers find your station</p>
                  </div>
                </div>
                <Link 
                  to="/owner/profile" 
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                >
                  View All →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {owner.stations.map((station) => (
                  <div 
                    key={station.id}
                    className={`p-4 rounded-xl transition-all ${
                      cngQuantity[station.id] > 0
                        ? 'bg-white/20'
                        : 'bg-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{station.name}</p>
                        <p className="text-sm text-white/70">{station.city || 'Location not set'}</p>
                      </div>
                    </div>
                    
                    {/* Quantity Display/Edit */}
                    <div className="mb-3">
                      {editingQuantity === station.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={tempQuantity}
                            onChange={(e) => setTempQuantity(e.target.value)}
                            className="w-24 px-3 py-2 rounded-lg text-gray-900 text-center font-bold"
                            placeholder="0"
                            autoFocus
                          />
                          <span className="text-white font-medium">kg</span>
                          <button
                            onClick={() => handleQuantityUpdate(station.id, parseFloat(tempQuantity) || 0)}
                            disabled={updatingCng === station.id}
                            className="px-3 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors disabled:opacity-50"
                          >
                            {updatingCng === station.id ? '...' : '✓'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingQuantity(null);
                              setTempQuantity('');
                            }}
                            className="px-3 py-2 bg-white/20 rounded-lg font-medium hover:bg-white/30 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingQuantity(station.id);
                            setTempQuantity((cngQuantity[station.id] || 0).toString());
                          }}
                          className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors w-full"
                        >
                          <span className="text-3xl font-bold">{cngQuantity[station.id] || 0}</span>
                          <span className="text-lg text-white/80">kg</span>
                          <span className="ml-auto text-white/60 text-sm">Click to update</span>
                        </button>
                      )}
                    </div>

                    {/* Quick quantity buttons */}
                    {editingQuantity !== station.id && (
                      <div className="flex gap-2 mb-3">
                        {[0, 50, 100, 200, 500].map((qty) => (
                          <button
                            key={qty}
                            onClick={() => handleQuantityUpdate(station.id, qty)}
                            disabled={updatingCng === station.id}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              cngQuantity[station.id] === qty
                                ? 'bg-white text-green-600'
                                : qty === 0
                                ? 'bg-red-500/50 hover:bg-red-500/70 text-white'
                                : 'bg-white/20 hover:bg-white/30 text-white'
                            }`}
                          >
                            {qty === 0 ? 'Empty' : `${qty}`}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${cngQuantity[station.id] > 0 ? 'text-green-200' : 'text-red-200'}`}>
                        {cngQuantity[station.id] > 0 ? `✓ ${cngQuantity[station.id]} kg Available` : '✗ Out of Stock'}
                      </span>
                      <span className="text-white/60 text-xs">
                        {formatLastUpdated(station.cngUpdatedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="text-sm text-white/90">
                  💡 <strong>Tip:</strong> Update CNG stock (in kg) daily to improve visibility and help drivers find your station!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link to="/owner/add-station" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Add Station</span>
            </Link>
            <Link to="/owner/subscription" className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm border-2 border-orange-300 hover:border-orange-400 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-orange-600">Buy Subscription</span>
            </Link>
            <Link to="/owner/profile" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">⛽</span>
              </div>
              <span className="text-sm font-medium text-gray-700">CNG Status</span>
            </Link>
            <Link to="/owner/profile" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </Link>
            <Link to="/owner/profile" className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
