import { useState, useEffect } from 'react';
import { Filter, CreditCard, CheckCircle, Clock, RotateCcw, Ban, Loader } from 'lucide-react';

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
  const [subscriptions, setSubscriptions] = useState<SubscriptionRequest[]>([]);
  const [owners, setOwners] = useState<any[]>([]); // For the "Owners without subscription" table
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

      const response = await fetch(`${API_URL}/admin/owners?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      setOwners(data.owners || []);

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

      fetchData();
    } catch (error) {
      console.error('Error deactivating subscription:', error);
      alert('Failed to deactivate subscription');
    }
  };

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, string> = {
      basic: 'bg-slate-700 text-slate-300 border-slate-600',
      standard: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      premium: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    return `px-3 py-1 rounded-full text-xs font-medium border ${badges[plan] || 'bg-slate-700 text-slate-300 border-slate-600'} uppercase tracking-wider`;
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
          <p className="text-slate-400 mt-1">Track revenue and manage plan statuses.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-blue-500 text-blue-500">
            <CreditCard className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium">Total Subscribers</p>
            <h3 className="text-3xl font-bold text-white mt-1">{subscriptions.length}</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-emerald-500 text-emerald-500">
            <CheckCircle className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium">Active Subscriptions</p>
            <h3 className="text-3xl font-bold text-emerald-400 mt-1">{activeCount}</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-red-500 text-red-500">
            <Clock className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium">Expired</p>
            <h3 className="text-3xl font-bold text-red-400 mt-1">{expiredCount}</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-purple-500 text-purple-500">
            <Filter className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium">Monthly Revenue</p>
            <h3 className="text-3xl font-bold text-purple-400 mt-1">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-xl flex gap-2">
        {['all', 'active', 'expired'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              } capitalize`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Subscriptions Table */}
      <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-10 h-10 text-primary-500 animate-spin mb-4" />
              <p className="text-slate-400">Loading subscriptions...</p>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No subscriptions found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                  <th className="p-6">Owner</th>
                  <th className="p-6">Plan</th>
                  <th className="p-6">Amount</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Expires</th>
                  <th className="p-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div>
                        <p className="font-medium text-slate-200">{sub.ownerName}</p>
                        <p className="text-xs text-slate-500">{sub.ownerEmail}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={getPlanBadge(sub.planType)}>{sub.planType}</span>
                    </td>
                    <td className="p-6">
                      <p className="font-medium text-slate-300">₹{sub.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">/month</p>
                    </td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${sub.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {sub.status === 'active' ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="p-6 text-slate-400 text-sm">
                      {sub.expiresAt ? formatDate(sub.expiresAt) : 'N/A'}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        {sub.status === 'expired' && (
                          <button
                            onClick={() => handleActivateSubscription(sub.ownerId, sub.planType)}
                            className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Renew"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        {sub.status === 'active' && (
                          <button
                            onClick={() => handleDeactivateSubscription(sub.ownerId)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Deactivate"
                          >
                            <Ban className="w-4 h-4" />
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
      </div>

      {/* Owners Without Subscription */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-6">Owners Without Subscription</h2>
        <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                <th className="p-6">Owner</th>
                <th className="p-6">Stations</th>
                <th className="p-6">Joined</th>
                <th className="p-6">Assign Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {owners.filter(o => !o.subscriptionType).slice(0, 10).map((owner) => (
                <tr key={owner.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div>
                      <p className="font-medium text-slate-200">{owner.name}</p>
                      <p className="text-xs text-slate-500">{owner.email}</p>
                    </div>
                  </td>
                  <td className="p-6 text-slate-300">
                    {owner._count?.stations || 0}
                  </td>
                  <td className="p-6 text-slate-400">
                    {formatDate(owner.createdAt)}
                  </td>
                  <td className="p-6">
                    <select
                      id={`assignPlan-${owner.id}`}
                      name={`assignPlan-${owner.id}`}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleActivateSubscription(owner.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="bg-slate-800 border-none rounded-lg py-1.5 px-3 text-sm text-slate-300 focus:ring-1 focus:ring-primary-500 cursor-pointer"
                      defaultValue=""
                      aria-label="Assign Subscription"
                    >
                      <option value="" disabled>Select Plan...</option>
                      <option value="basic">Basic (₹999)</option>
                      <option value="standard">Standard (₹2499)</option>
                      <option value="premium">Premium (₹4999)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
