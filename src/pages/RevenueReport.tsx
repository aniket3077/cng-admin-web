import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function RevenueReport() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('subscriberData');
    navigate('/login');
  };

  const monthlyRevenue: { month: string; revenue: number; subscribers: number }[] = [];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Report</h1>
                <p className="text-gray-600">Financial overview and subscription revenue analytics</p>
              </div>
              <select className="px-4 py-2 border border-sky-200 rounded-lg text-sm text-gray-700 bg-white">
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100 text-sm">Total Revenue</span>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-black mb-1">₹0</div>
                <p className="text-green-100 text-sm">+0% from last year</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm">Monthly Average</span>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-4xl font-black mb-1">₹0</div>
                <p className="text-blue-100 text-sm">Across 0 months</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-100 text-sm">Active Subscribers</span>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-black mb-1">0</div>
                <p className="text-purple-100 text-sm">+0% growth</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-100 text-sm">This Month</span>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-4xl font-black mb-1">₹0</div>
                <p className="text-orange-100 text-sm">No data yet</p>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl p-8 border border-sky-100 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Monthly Revenue Trend</h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-sky-500"></div>
                    <span className="text-sm text-gray-600">Revenue (₹)</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-80">
                <div className="absolute inset-0 flex items-end justify-between px-4">
                  {monthlyRevenue.map((item, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 mx-2">
                      <div className="relative w-full flex flex-col items-center gap-1">
                        {/* Revenue bar */}
                        <div 
                          className="w-full bg-gradient-to-t from-sky-500 to-sky-400 rounded-t-lg hover:from-sky-600 hover:to-sky-500 transition-all cursor-pointer shadow-lg" 
                          style={{ height: `${(item.revenue / maxRevenue) * 250}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                            ₹{item.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-700 mt-3">{item.month}</div>
                      <div className="text-xs text-gray-500">{item.subscribers} subs</div>
                    </div>
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-gray-400 pr-2">
                  <span>₹40K</span>
                  <span>₹30K</span>
                  <span>₹20K</span>
                  <span>₹10K</span>
                  <span>₹0</span>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-2 gap-6">
              {/* By Plan Type */}
              <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Plan Type</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium text-gray-900">Premium Plan</span>
                    </div>
                    <span className="font-bold text-gray-900">₹0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium text-gray-900">Basic Plan</span>
                    </div>
                    <span className="font-bold text-gray-900">₹0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="font-medium text-gray-900">Enterprise Plan</span>
                    </div>
                    <span className="font-bold text-gray-900">₹0</span>
                  </div>
                </div>
              </div>

              {/* Top Subscribers */}
              <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Revenue Contributors</h3>
                <div className="flex items-center justify-center h-40 text-gray-500">
                  No revenue data available
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
