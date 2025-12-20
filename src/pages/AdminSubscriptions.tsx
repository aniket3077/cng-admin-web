import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

interface SubscriptionRequest {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  planType: string;
  status: string;
  amount: number;
  requestedAt: string;
  activatedAt?: string;
  expiresAt?: string;
}

export default function AdminSubscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<SubscriptionRequest[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'https://cng-backend.vercel.app/api';

  const planPrices: Record<string, number> = {
    basic: 999,
    standard: 2499,
    premium: 4999,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch owners with subscription data
      const response = await fetch(`${API_URL}/admin/owners?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      setOwners(data.owners || []);

      // Transform owners to subscription view
      const subs = data.owners
        .filter((owner: any) => owner.subscriptionType)
        .map((owner: any) => ({
          id: owner.id,
          ownerId: owner.id,
          ownerName: owner.name,
          ownerEmail: owner.email,
          planType: owner.subscriptionType,
          status: owner.subscriptionEndsAt && new Date(owner.subscriptionEndsAt) > new Date() ? 'active' : 'expired',
          amount: planPrices[owner.subscriptionType] || 0,
          activatedAt: owner.updatedAt,
          expiresAt: owner.subscriptionEndsAt,
        }));

      setSubscriptions(subs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateSubscription = async (ownerId: string, planType: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const response = await fetch(`${API_URL}/admin/owners/${ownerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionType: planType,
          subscriptionEndsAt: expiryDate.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to activate subscription');
      
      alert('Subscription activated successfully!');
      fetchData();
    } catch (error) {
      console.error('Error activating subscription:', error);
      alert('Failed to activate subscription');
    }
  };

  const handleDeactivateSubscription = async (ownerId: string) => {
    if (!confirm('Are you sure you want to deactivate this subscription?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/admin/owners/${ownerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionType: null,
          subscriptionEndsAt: null,
        }),
      });

      if (!response.ok) throw new Error('Failed to deactivate subscription');
      
      alert('Subscription deactivated!');
      fetchData();
    } catch (error) {
      console.error('Error deactivating subscription:', error);
      alert('Failed to deactivate subscription');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, string> = {
      basic: 'bg-gray-100 text-gray-800',
      standard: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
    };
    return badges[plan] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredSubscriptions = filter === 'all' 
    ? subscriptions 
    : subscriptions.filter(s => s.status === filter);

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const expiredCount = subscriptions.filter(s => s.status === 'expired').length;
  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
                <p className="text-gray-600">Manage station owner subscriptions</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-sky-100 shadow-sm">
                <p className="text-sm text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-green-700">Active Subscriptions</p>
                <p className="text-2xl font-bold text-green-800">{activeCount}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <p className="text-sm text-red-700">Expired</p>
                <p className="text-2xl font-bold text-red-800">{expiredCount}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-purple-700">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-800">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-sky-100 shadow-sm mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({subscriptions.length})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'active' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setFilter('expired')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'expired' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Expired ({expiredCount})
                </button>
              </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white rounded-xl border border-sky-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                </div>
              ) : filteredSubscriptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-2">No subscriptions found</p>
                  <p className="text-sm">Station owners can subscribe from their dashboard</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Owner</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Plan</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Amount</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Expires</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900">{sub.ownerName}</p>
                            <p className="text-sm text-gray-500">{sub.ownerEmail}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getPlanBadge(sub.planType)}`}>
                            {sub.planType}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-gray-900">₹{sub.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">/month</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-900">
                            {sub.expiresAt ? formatDate(sub.expiresAt) : 'N/A'}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {sub.status === 'expired' && (
                              <button
                                onClick={() => handleActivateSubscription(sub.ownerId, sub.planType)}
                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                              >
                                Renew
                              </button>
                            )}
                            {sub.status === 'active' && (
                              <button
                                onClick={() => handleDeactivateSubscription(sub.ownerId)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Deactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Owners Without Subscription */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Owners Without Subscription</h2>
              <div className="bg-white rounded-xl border border-sky-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Owner</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Stations</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Joined</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {owners.filter(o => !o.subscriptionType).slice(0, 10).map((owner) => (
                      <tr key={owner.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900">{owner.name}</p>
                            <p className="text-sm text-gray-500">{owner.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-900">{owner._count?.stations || 0}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-900">{formatDate(owner.createdAt)}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleActivateSubscription(owner.id, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                              defaultValue=""
                            >
                              <option value="" disabled>Activate Plan</option>
                              <option value="basic">Basic (₹999)</option>
                              <option value="standard">Standard (₹2499)</option>
                              <option value="premium">Premium (₹4999)</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
