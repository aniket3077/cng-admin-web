import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { adminApi } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 7320,
    totalOrders: 19320,
    totalSales: 20320,
    totalPending: 7320,
    stations: 0,
    owners: 0,
    tickets: 0
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

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

  const salesData = [
    { month: 'Jan', value: 15000 },
    { month: 'Feb', value: 18500 },
    { month: 'Mar', value: 22000 },
    { month: 'Apr', value: 28543 },
    { month: 'May', value: 25000 },
    { month: 'Jun', value: 27000 },
  ];

  const productData = [
    { month: 'Sat', gas: 150, oil: 100, diesel: 80 },
    { month: 'Sun', gas: 180, oil: 120, diesel: 70 },
    { month: 'Mar', gas: 140, oil: 130, diesel: 90 },
    { month: 'Apr', gas: 160, oil: 110, diesel: 85 },
    { month: 'May', gas: 130, oil: 90, diesel: 70 },
    { month: 'Jun', gas: 170, oil: 140, diesel: 80 },
    { month: 'Fri', gas: 190, oil: 150, diesel: 100 },
  ];

  const orderStats = {
    open: 4045,
    pending: 3245,
    accepted: 1252,
  };

  const maxProduct = 500;
  const maxSales = Math.max(...salesData.map(d => d.value));

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <select aria-label="Date range filter" className="px-4 py-2 border border-sky-200 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                <option>Sort by: 01 Jan - 30 Jun</option>
                <option>Sort by: 01 Jul - 31 Dec</option>
                <option>Sort by: This Year</option>
              </select>
            </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Total Users */}
            <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-1">Total Users</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers.toLocaleString()}</div>
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,25 20,20 40,22 60,18 80,15 100,10" fill="none" stroke="#0EA5E9" strokeWidth="2"/>
              </svg>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-1">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalOrders.toLocaleString()}</div>
              <div className="flex gap-1 items-end h-8">
                {[15, 10, 12, 8, 18, 25, 16, 12, 20, 15].map((h, i) => (
                  <div key={i} className={`flex-1 ${i === 5 ? 'bg-green-500' : 'bg-sky-200'} rounded-t`} style={{ height: `${h}px` }}></div>
                ))}
              </div>
            </div>

            {/* Total Sales */}
            <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-1">Total Sales</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalSales.toLocaleString()}</div>
              <div className="flex gap-1 items-end h-8">
                {[18, 15, 20, 12, 25, 18, 22, 16, 20, 15].map((h, i) => (
                  <div key={i} className={`flex-1 ${i === 4 ? 'bg-indigo-600' : 'bg-sky-200'} rounded-t`} style={{ height: `${h}px` }}></div>
                ))}
              </div>
            </div>

            {/* Total Pending */}
            <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-1">Total Pending</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalPending.toLocaleString()}</div>
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,20 20,18 40,22 60,15 80,12 100,8" fill="none" stroke="#F59E0B" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Sales Summary */}
            <div className="col-span-2 bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Summary</h3>
              <div className="relative h-64">
                <div className="absolute inset-0 flex items-end justify-between px-4">
                  {salesData.map((item, i) => {
                    const height = (item.value / maxSales) * 100;
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 mx-1">
                        <div className="relative w-full">
                          {item.month === 'Apr' && (
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-sky-700 text-white px-3 py-1 rounded text-sm font-semibold whitespace-nowrap">
                              ${item.value.toLocaleString()}
                            </div>
                          )}
                          <div 
                            className="w-full bg-gradient-to-t from-sky-500 to-sky-400 rounded-t transition-all hover:opacity-80"
                            style={{ height: `${height}%`, minHeight: '40px' }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">{item.month}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400">
                  <span>$50</span>
                  <span>$40</span>
                  <span>$30</span>
                  <span>$10</span>
                  <span>$0</span>
                </div>
              </div>
            </div>

            {/* Orders Donut */}
            <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders</h3>
              <div className="flex justify-center items-center mb-6">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E0F2FE" strokeWidth="12"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#0EA5E9" strokeWidth="12" 
                      strokeDasharray={`${(orderStats.open / (orderStats.open + orderStats.pending + orderStats.accepted)) * 251} 251`} 
                      strokeDashoffset="0"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#22C55E" strokeWidth="12" 
                      strokeDasharray={`${(orderStats.pending / (orderStats.open + orderStats.pending + orderStats.accepted)) * 251} 251`} 
                      strokeDashoffset={`-${(orderStats.open / (orderStats.open + orderStats.pending + orderStats.accepted)) * 251}`}/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#6366F1" strokeWidth="12" 
                      strokeDasharray={`${(orderStats.accepted / (orderStats.open + orderStats.pending + orderStats.accepted)) * 251} 251`} 
                      strokeDashoffset={`-${((orderStats.open + orderStats.pending) / (orderStats.open + orderStats.pending + orderStats.accepted)) * 251}`}/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-600">Total Orders</div>
                    <div className="text-2xl font-bold text-gray-900">8,543</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                    <span className="text-sm text-gray-600">Open</span>
                  </div>
                  <span className="font-semibold text-gray-900">{orderStats.open.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="font-semibold text-gray-900">{orderStats.pending.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                    <span className="text-sm text-gray-600">Accepted</span>
                  </div>
                  <span className="font-semibold text-gray-900">{orderStats.accepted.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Summary */}
          <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Product Summary</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                  <span className="text-sm text-gray-600">CNG</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Petrol</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-sm text-gray-600">Diesel</span>
                </div>
              </div>
            </div>
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-between px-4">
                {productData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 mx-1">
                    <div className="relative w-full flex flex-col items-center gap-1">
                      <div className="w-full bg-sky-500 rounded-t" style={{ height: `${(item.gas / maxProduct) * 180}px` }}></div>
                      <div className="w-full bg-green-500 rounded-t" style={{ height: `${(item.oil / maxProduct) * 180}px` }}></div>
                      <div className="w-full bg-amber-400 rounded-t" style={{ height: `${(item.diesel / maxProduct) * 180}px` }}></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">{item.month}</div>
                  </div>
                ))}
              </div>
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400">
                <span>500</span>
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
