import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { adminApi } from '../services/api';

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscribers: 0,
    pendingPayments: 0,
    expiringSoon: 0,
  });

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch stations with subscriptions
      const stationsData = await adminApi.getStations(1, '', undefined, undefined);
      
      // Extract subscription data
      const subsData: any[] = [];
      let totalRev = 0;
      let activeCount = 0;
      let expiring = 0;
      
      stationsData.stations.forEach((station: any) => {
        if (station.subscriptions && station.subscriptions.length > 0) {
          station.subscriptions.forEach((sub: any) => {
            if (sub.status === 'active') {
              activeCount++;
              totalRev += sub.amount || 0;
              
              // Check if expiring within 7 days
              const endDate = new Date(sub.endDate);
              const daysUntilExpiry = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
                expiring++;
              }
              
              subsData.push({
                id: sub.id,
                subscriberName: station.owner?.name || station.name,
                planType: sub.planType,
                startDate: new Date(sub.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                endDate: new Date(sub.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                amount: sub.amount,
                status: sub.status,
              });
            }
          });
        }
      });
      
      setSubscriptions(subsData);
      setStats({
        totalRevenue: totalRev,
        activeSubscribers: activeCount,
        pendingPayments: 0,
        expiringSoon: expiring,
      });
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('subscriberData');
    navigate('/login');
  };

  // Sample subscription plans
  const plans: any[] = [];

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
              <p className="text-gray-600">Manage subscription plans and subscriber payments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Total Revenue</span>
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</div>
                <p className="text-sm text-green-600 mt-1">+0% from last month</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Active Subscribers</span>
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.activeSubscribers}</div>
                <p className="text-sm text-blue-600 mt-1">0 new this week</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Pending Payments</span>
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">0</div>
                <p className="text-sm text-orange-600 mt-1">₹0 pending</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Expiring Soon</span>
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.expiringSoon}</div>
                <p className="text-sm text-red-600 mt-1">Within 7 days</p>
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl p-6 border-2 border-sky-200 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {plan.status}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-black text-sky-600">₹{plan.price}</span>
                      <span className="text-gray-600 ml-2">/ {plan.duration}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{plan.subscribers}</p>
                      <p className="text-xs text-gray-600">Subscribers</p>
                    </div>
                    <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium text-sm transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Subscriptions */}
            <div className="bg-white rounded-xl border border-sky-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Subscriptions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscriber</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Loading subscriptions...
                        </td>
                      </tr>
                    ) : subscriptions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No subscriptions found
                        </td>
                      </tr>
                    ) : (
                      subscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sub.subscriberName}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 capitalize">{sub.planType} Plan</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{sub.startDate}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{sub.endDate}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{sub.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sub.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : sub.status === 'expired'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
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
