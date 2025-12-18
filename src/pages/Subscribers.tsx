import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  stationId: string | null;
  stationName: string | null;
  stationCity: string | null;
  stationLat: number | null;
  stationLng: number | null;
  cngAvailable: number;
  approvalStatus: string;
  isVerified: boolean;
  createdAt: string;
}

export default function Subscribers() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const baseUrl = apiUrl.replace(/\/api$/, ''); // Remove /api suffix if present
      const response = await fetch(`${baseUrl}/admin/owners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch subscribers');

      const data = await response.json();
      
      // Map the data to include station details
      const subscribersData = data.owners.map((owner: any) => ({
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        stationId: owner.stations?.[0]?.id || null,
        stationName: owner.stations?.[0]?.name || null,
        stationCity: owner.stations?.[0]?.city || null,
        stationLat: owner.stations?.[0]?.lat || null,
        stationLng: owner.stations?.[0]?.lng || null,
        cngAvailable: owner.stations?.[0]?.cngAvailable || 0,
        approvalStatus: owner.stations?.[0]?.approvalStatus || 'pending',
        isVerified: owner.stations?.[0]?.isVerified || false,
        createdAt: owner.createdAt,
      }));
      
      console.log('Subscribers data:', subscribersData);
      console.log('First subscriber:', subscribersData[0]);
      setSubscribers(subscribersData);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (subscriberId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Find the subscriber's station
      const subscriber = subscribers.find(s => s.id === subscriberId);
      if (!subscriber || !subscriber.stationId) {
        alert('No station found for this subscriber');
        return;
      }

      // Approve and verify the station
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const baseUrl = apiUrl.replace(/\/api$/, ''); // Remove /api suffix if present
      const response = await fetch(`${baseUrl}/api/admin/stations`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: subscriber.stationId,
          approvalStatus: 'approved',
          isVerified: true
        }),
      });

      if (!response.ok) throw new Error('Failed to approve station');

      alert('Station approved and will now appear on the map!');
      // Refresh the list
      fetchSubscribers();
    } catch (error) {
      console.error('Error approving station:', error);
      alert('Failed to approve station');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.stationName && sub.stationName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalCNG = filteredSubscribers.reduce((sum, sub) => sum + (sub.cngAvailable || 0), 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col ml-64">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Station Approvals</h1>
            <p className="text-gray-600">Approve stations from registered owners and monitor CNG availability</p>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Total Subscribers</h3>
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">{subscribers.length}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Active Subscribers</h3>
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">
                {subscribers.filter(s => s.status === 'active').length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Total CNG Available</h3>
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-3xl font-bold">{totalCNG.toLocaleString()} kg</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Avg per Station</h3>
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">
                {subscribers.length > 0 ? Math.round(totalCNG / subscribers.length) : 0} kg
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subscriber
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Station Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      CNG Available Today
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Station Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Station Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                          <span className="ml-3">Loading subscribers...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No subscribers found
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                              <span className="text-sky-600 font-semibold text-sm">
                                {subscriber.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{subscriber.name}</div>
                              <div className="text-xs text-gray-500">
                                Joined {new Date(subscriber.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {subscriber.stationName || 'No station'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {subscriber.stationCity || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{subscriber.email}</div>
                          <div className="text-xs text-gray-500">{subscriber.phone || 'No phone'}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50">
                            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-sm font-semibold text-green-700">
                              {subscriber.cngAvailable || 0} kg
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            subscriber.approvalStatus === 'approved' && subscriber.isVerified
                              ? 'bg-green-100 text-green-800'
                              : subscriber.approvalStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subscriber.approvalStatus === 'approved' && subscriber.isVerified ? 'approved' : subscriber.approvalStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {subscriber.stationId ? (
                            subscriber.approvalStatus === 'pending' || !subscriber.isVerified ? (
                              <button
                                onClick={() => handleApprove(subscriber.id)}
                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                title={`Approve station: ${subscriber.stationName}`}
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve Station
                              </button>
                            ) : subscriber.approvalStatus === 'approved' && subscriber.isVerified ? (
                              <div className="flex items-center justify-center text-green-600 text-sm font-medium">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                On Map
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm italic">Rejected</span>
                            )
                          ) : (
                            <span className="text-gray-400 text-sm">No station</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
