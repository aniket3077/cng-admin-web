import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { adminApi, StationOwner } from '../services/api';

export default function StationOwners() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState<StationOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kycFilter, setKycFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOwner, setSelectedOwner] = useState<StationOwner | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, [currentPage, statusFilter, kycFilter]);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getOwners(currentPage, 20, {
        status: statusFilter || undefined,
        kycStatus: kycFilter || undefined,
        search: searchTerm || undefined,
      });
      setOwners(response.owners || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotal(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching owners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOwners();
  };

  const handleApprove = async (ownerId: string) => {
    try {
      await adminApi.updateOwner(ownerId, { status: 'active' });
      fetchOwners();
    } catch (error) {
      console.error('Error approving owner:', error);
      alert('Failed to approve owner');
    }
  };

  const handleReject = async (ownerId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await adminApi.updateOwner(ownerId, { status: 'rejected', kycRejectionReason: reason });
      fetchOwners();
    } catch (error) {
      console.error('Error rejecting owner:', error);
      alert('Failed to reject owner');
    }
  };

  const handleSuspend = async (ownerId: string) => {
    if (!confirm('Are you sure you want to suspend this owner?')) return;
    
    try {
      await adminApi.updateOwner(ownerId, { status: 'suspended' });
      fetchOwners();
    } catch (error) {
      console.error('Error suspending owner:', error);
      alert('Failed to suspend owner');
    }
  };



  const handleDelete = async (ownerId: string) => {
    if (!confirm('Are you sure you want to delete this owner? This action cannot be undone.')) return;
    
    try {
      await adminApi.deleteOwner(ownerId);
      fetchOwners();
    } catch (error) {
      console.error('Error deleting owner:', error);
      alert('Failed to delete owner');
    }
  };

  const handleAssignSubscription = async (ownerId: string) => {
    const owner = owners.find(o => o.id === ownerId);
    if (!owner) return;

    const planType = prompt('Enter subscription plan type:\n1. free\n2. basic (₹999/month)\n3. premium (₹9,999/year)\n\nEnter plan name:');
    if (!planType || !['free', 'basic', 'premium'].includes(planType.toLowerCase())) {
      alert('Invalid plan type. Please enter: free, basic, or premium');
      return;
    }

    const duration = planType.toLowerCase() === 'premium' ? 365 : planType.toLowerCase() === 'basic' ? 30 : 30;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    try {
      // Update owner with subscription info
      await adminApi.updateOwner(ownerId, { 
        subscriptionType: planType.toLowerCase(),
        subscriptionEnd: endDate.toISOString()
      });
      alert(`${planType} subscription assigned successfully!`);
      fetchOwners();
    } catch (error) {
      console.error('Error assigning subscription:', error);
      alert('Failed to assign subscription');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getKycBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOwners = searchTerm
    ? owners.filter(owner =>
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : owners;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col ml-64">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Station Owners</h1>
            <p className="text-gray-600">Manage station owner accounts, KYC verification, and approvals</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Owners</p>
                  <p className="text-2xl font-bold text-gray-900">{total}</p>
                </div>
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {owners.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Owners</p>
                  <p className="text-2xl font-bold text-green-600">
                    {owners.filter(o => o.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">KYC Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {owners.filter(o => o.kycStatus === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={kycFilter}
                onChange={(e) => { setKycFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                aria-label="Filter by KYC status"
              >
                <option value="">All KYC Status</option>
                <option value="pending">KYC Pending</option>
                <option value="verified">KYC Verified</option>
                <option value="rejected">KYC Rejected</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">KYC</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Stations</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                          <span className="ml-3">Loading owners...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOwners.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No station owners found
                      </td>
                    </tr>
                  ) : (
                    filteredOwners.map((owner) => (
                      <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                              <span className="text-sky-600 font-semibold">
                                {owner.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                              <div className="text-sm text-gray-500">{owner.email}</div>
                              <div className="text-xs text-gray-400">{owner.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{owner.companyName || '-'}</div>
                          {owner.gstNumber && (
                            <div className="text-xs text-gray-500">GST: {owner.gstNumber}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(owner.status || 'pending')}`}>
                            {owner.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getKycBadge(owner.kycStatus || 'pending')}`}>
                            {owner.kycStatus?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-medium text-gray-900">
                            {owner._count?.stations || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setSelectedOwner(owner); setShowModal(true); }}
                              className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            {(owner.status?.toLowerCase() === 'pending' || !owner.status) && (
                              <>
                                <button
                                  onClick={() => handleApprove(owner.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                  title="Approve Owner"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(owner.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                  title="Reject Owner"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Reject
                                </button>
                              </>
                            )}
                            {owner.status?.toLowerCase() === 'active' && (
                              <>
                                <button
                                  onClick={() => handleSuspend(owner.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
                                  title="Suspend Owner"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                  Suspend
                                </button>
                                <button
                                  onClick={() => handleAssignSubscription(owner.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                                  title="Assign Subscription"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Subscription
                                </button>
                              </>
                            )}
                            {owner.status === 'active' && (
                              <button
                                onClick={() => handleSuspend(owner.id)}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                                title="Suspend"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(owner.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages} ({total} total)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Owner Details Modal */}
      {showModal && selectedOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Owner Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Name</label>
                    <p className="text-sm font-medium">{selectedOwner.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <p className="text-sm font-medium">{selectedOwner.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <p className="text-sm font-medium">{selectedOwner.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedOwner.status || 'pending')}`}>
                      {selectedOwner.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Company Name</label>
                    <p className="text-sm font-medium">{selectedOwner.companyName || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">GST Number</label>
                    <p className="text-sm font-medium">{selectedOwner.gstNumber || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">PAN Number</label>
                    <p className="text-sm font-medium">{selectedOwner.panNumber || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">KYC Status</label>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getKycBadge(selectedOwner.kycStatus || 'pending')}`}>
                      {selectedOwner.kycStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Address</h3>
                <p className="text-sm">
                  {selectedOwner.address || '-'}<br />
                  {selectedOwner.city}, {selectedOwner.state} {selectedOwner.postalCode}
                </p>
              </div>

              {/* Stations */}
              {selectedOwner.stations && selectedOwner.stations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Stations ({selectedOwner.stations.length})</h3>
                  <div className="space-y-2">
                    {selectedOwner.stations.map(station => (
                      <div key={station.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{station.name}</p>
                          <p className="text-xs text-gray-500">{station.city}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                          station.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                          station.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {station.approvalStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="text-xs text-gray-500 pt-4 border-t">
                <p>Created: {new Date(selectedOwner.createdAt).toLocaleString()}</p>
                {selectedOwner.lastLoginAt && (
                  <p>Last Login: {new Date(selectedOwner.lastLoginAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
