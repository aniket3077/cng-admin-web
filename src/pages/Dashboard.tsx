import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi, Station } from '../services/api';

export default function Dashboard() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [approvalFilter, setApprovalFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadStations();
  }, [page, search, approvalFilter]);

  const loadStations = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStations(page, search, approvalFilter);
      setStations(data.stations);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await adminApi.deleteStation(id);
        loadStations();
      } catch (error) {
        alert('Failed to delete station');
      }
    }
  };

  const handleApprove = async (id: string, name: string) => {
    if (confirm(`Approve station "${name}"?`)) {
      try {
        await adminApi.updateStation(id, { approvalStatus: 'approved' });
        alert('Station approved successfully');
        loadStations();
      } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to approve station');
      }
    }
  };

  const handleReject = async (id: string, name: string) => {
    const reason = prompt(`Enter rejection reason for "${name}":`);
    if (!reason) return;

    try {
      await adminApi.updateStation(id, { 
        approvalStatus: 'rejected',
        rejectionReason: reason 
      });
      alert('Station rejected');
      loadStations();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to reject station');
    }
  };

  const getApprovalBadge = (status?: string) => {
    if (!status || status === 'approved') {
      return null;
    }
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Fuel Bharat Admin
              </h1>
              <div className="hidden md:flex gap-6">
                <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Stations
                </Link>
                <Link to="/owners" className="text-gray-400 hover:text-white font-medium transition-colors">
                  Station Owners
                </Link>
                <Link to="/support" className="text-gray-400 hover:text-white font-medium transition-colors">
                  Support Tickets
                </Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Admin</h2>
          <p className="text-gray-400">Monitor your fuel station network, manage approvals, and track performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
              <span className="text-xs text-blue-400 font-semibold">+12% this month</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stations.length}</div>
            <div className="text-gray-400 text-sm">Total Stations</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <span className="text-xs text-green-400 font-semibold">Active</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stations.filter(s => s.approvalStatus === 'approved' || !s.approvalStatus).length}
            </div>
            <div className="text-gray-400 text-sm">Approved</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <span className="text-xs text-yellow-400 font-semibold">Needs Attention</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stations.filter(s => s.approvalStatus === 'pending').length}
            </div>
            <div className="text-gray-400 text-sm">Pending Approval</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-xs text-purple-400 font-semibold">Today</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">₹2.5L</div>
            <div className="text-gray-400 text-sm">Revenue</div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Fuel Stations Management</h2>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search stations..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={approvalFilter}
              onChange={(e) => {
                setApprovalFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Link
              to="/add"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/25"
            >
              + Add Station
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Station
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Fuel Types
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Approval
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {stations.map((station) => (
                      <tr key={station.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">
                            {station.name}
                          </div>
                          {station.phone && (
                            <div className="text-sm text-gray-400">{station.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {station.owner ? (
                            <div>
                              <div className="text-sm font-medium text-white">
                                {station.owner.name}
                              </div>
                              <div className="text-xs text-gray-400">{station.owner.email}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Admin Added</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white">
                            {station.city}, {station.state}
                          </div>
                          <div className="text-xs text-gray-400">
                            {station.lat?.toFixed(4)}, {station.lng?.toFixed(4)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {station.fuelTypes?.split(',').map((fuel) => (
                              <span
                                key={fuel}
                                className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-500/30"
                              >
                                {fuel}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getApprovalBadge(station.approvalStatus)}
                          {station.approvalStatus === 'rejected' && station.rejectionReason && (
                            <div className="text-xs text-red-400 mt-1">
                              {station.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-semibold ${
                              station.isVerified
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            }`}
                          >
                            {station.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <div className="flex flex-col gap-2 items-end">
                            {station.approvalStatus === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(station.id, station.name)}
                                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  onClick={() => handleReject(station.id, station.name)}
                                  className="text-red-400 hover:text-red-300 font-medium transition-colors"
                                >
                                  ✗ Reject
                                </button>
                              </>
                            )}
                            <Link
                              to={`/edit/${station.id}`}
                              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                              ✎ Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(station.id, station.name)}
                              className="text-red-400 hover:text-red-300 font-medium transition-colors"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-all font-medium"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-400 bg-gray-800/30 px-6 py-3 rounded-xl border border-gray-700/50">
                Page <span className="text-white font-semibold">{page}</span> of <span className="text-white font-semibold">{totalPages}</span>
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-all font-medium"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
