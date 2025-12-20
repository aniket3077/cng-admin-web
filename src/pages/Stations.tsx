import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  lat: number;
  lng: number;
  fuelTypes: string;
  amenities: string;
  approvalStatus: string;
  isVerified: boolean;
  cngAvailable: boolean;
  cngUpdatedAt: string | null;
  createdAt: string;
  owner?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function Stations() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cngFilter, setCngFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://cng-backend.vercel.app/api';

  useEffect(() => {
    fetchStations();
  }, [currentPage, statusFilter, cngFilter]);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      let url = `${API_URL}/admin/stations?page=${currentPage}&limit=20`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (cngFilter) url += `&cngAvailable=${cngFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stations');
      
      const data = await response.json();
      setStations(data.stations || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStations();
  };

  const handleApprove = async (stationId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/stations/${stationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvalStatus: 'approved' }),
      });

      if (!response.ok) throw new Error('Failed to approve station');
      fetchStations();
      setShowModal(false);
    } catch (error) {
      console.error('Error approving station:', error);
      alert('Failed to approve station');
    }
  };

  const handleReject = async (stationId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/stations/${stationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvalStatus: 'rejected', rejectionReason: reason }),
      });

      if (!response.ok) throw new Error('Failed to reject station');
      fetchStations();
      setShowModal(false);
    } catch (error) {
      console.error('Error rejecting station:', error);
      alert('Failed to reject station');
    }
  };

  const handleVerify = async (stationId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/stations/${stationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified: true }),
      });

      if (!response.ok) throw new Error('Failed to verify station');
      fetchStations();
    } catch (error) {
      console.error('Error verifying station:', error);
      alert('Failed to verify station');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCngUpdated = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return formatDate(dateString);
  };

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Stations Management</h1>
                <p className="text-gray-600">Manage and approve CNG stations</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Total: {total} stations</span>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search by name, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={cngFilter}
                  onChange={(e) => setCngFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">All CNG Status</option>
                  <option value="true">CNG Available</option>
                  <option value="false">CNG Unavailable</option>
                </select>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-sky-100 shadow-sm">
                <p className="text-sm text-gray-600">Total Stations</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-sm text-yellow-700">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {stations.filter(s => s.approvalStatus === 'pending').length}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-green-700">CNG Available</p>
                <p className="text-2xl font-bold text-green-800">
                  {stations.filter(s => s.cngAvailable).length}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <p className="text-sm text-red-700">CNG Unavailable</p>
                <p className="text-2xl font-bold text-red-800">
                  {stations.filter(s => !s.cngAvailable).length}
                </p>
              </div>
            </div>

            {/* Stations Table */}
            <div className="bg-white rounded-xl border border-sky-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                </div>
              ) : stations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No stations found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Station</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Location</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">CNG Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Approval</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Verified</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stations.map((station) => (
                      <tr key={station.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900">{station.name}</p>
                            <p className="text-sm text-gray-500">{station.phone || 'No phone'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-900">{station.city}</p>
                          <p className="text-sm text-gray-500">{station.state}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${station.cngAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className={station.cngAvailable ? 'text-green-700' : 'text-red-700'}>
                              {station.cngAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Updated: {formatCngUpdated(station.cngUpdatedAt)}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(station.approvalStatus)}`}>
                            {station.approvalStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {station.isVerified ? (
                            <span className="text-green-600">✓ Verified</span>
                          ) : (
                            <span className="text-gray-400">Not verified</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedStation(station);
                                setShowModal(true);
                              }}
                              className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                            >
                              View
                            </button>
                            {station.approvalStatus === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(station.id)}
                                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(station.id)}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {!station.isVerified && station.approvalStatus === 'approved' && (
                              <button
                                onClick={() => handleVerify(station.id)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Station Details Modal */}
      {showModal && selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">Station Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Station Name</p>
                  <p className="font-medium">{selectedStation.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedStation.phone || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{selectedStation.address}</p>
                <p className="text-sm text-gray-500">{selectedStation.city}, {selectedStation.state}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Coordinates</p>
                  <p className="font-medium">{selectedStation.lat}, {selectedStation.lng}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fuel Types</p>
                  <p className="font-medium">{selectedStation.fuelTypes}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">CNG Status</p>
                  <p className={`font-medium ${selectedStation.cngAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedStation.cngAvailable ? '✓ Available' : '✗ Not Available'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Last updated: {formatCngUpdated(selectedStation.cngUpdatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approval Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedStation.approvalStatus)}`}>
                    {selectedStation.approvalStatus}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Amenities</p>
                <p className="font-medium">{selectedStation.amenities || 'None listed'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium">{formatDate(selectedStation.createdAt)}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              {selectedStation.approvalStatus === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedStation.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve Station
                  </button>
                  <button
                    onClick={() => handleReject(selectedStation.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject Station
                  </button>
                </>
              )}
              {!selectedStation.isVerified && selectedStation.approvalStatus === 'approved' && (
                <button
                  onClick={() => handleVerify(selectedStation.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Verify Station
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
