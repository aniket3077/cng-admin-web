import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, StationOwner } from '../services/api';

export default function StationOwners() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState<StationOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kycFilter, setKycFilter] = useState('');

  useEffect(() => {
    loadOwners();
  }, [page, statusFilter, kycFilter]);

  const loadOwners = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (searchTerm) filters.search = searchTerm;
      if (statusFilter) filters.status = statusFilter;
      if (kycFilter) filters.kycStatus = kycFilter;

      const data = await adminApi.getOwners(page, 20, filters);
      setOwners(data.owners);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      console.error('Error loading owners:', error);
      alert(error.response?.data?.error || 'Failed to load station owners');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadOwners();
  };

  const handleApprove = async (ownerId: string) => {
    if (!confirm('Approve this station owner?')) return;
    
    try {
      await adminApi.updateOwner(ownerId, {
        status: 'active',
        kycStatus: 'verified',
        emailVerified: true,
      });
      alert('Station owner approved successfully');
      loadOwners();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to approve owner');
    }
  };

  const handleReject = async (ownerId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminApi.updateOwner(ownerId, {
        status: 'rejected',
        kycStatus: 'rejected',
        kycRejectionReason: reason,
      });
      alert('Station owner rejected');
      loadOwners();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to reject owner');
    }
  };

  const handleSuspend = async (ownerId: string) => {
    if (!confirm('Suspend this station owner account?')) return;

    try {
      await adminApi.updateOwner(ownerId, {
        status: 'suspended',
      });
      alert('Station owner suspended');
      loadOwners();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to suspend owner');
    }
  };

  const handleDelete = async (ownerId: string) => {
    if (!confirm('Are you sure you want to delete this station owner? This action cannot be undone.')) return;

    try {
      await adminApi.deleteOwner(ownerId);
      alert('Station owner deleted successfully');
      loadOwners();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete owner');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getKycBadge = (kycStatus: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[kycStatus] || 'bg-gray-100 text-gray-800'}`}>
        {kycStatus.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Station Owners (CRM)</h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search by name, email, phone, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border rounded-md"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={kycFilter}
              onChange={(e) => {
                setKycFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All KYC</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Owners List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : owners.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No station owners found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KYC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {owners.map((owner) => (
                    <tr key={owner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                          <div className="text-sm text-gray-500">{owner.email}</div>
                          <div className="text-sm text-gray-500">{owner.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{owner.companyName || '-'}</div>
                        {owner.gstNumber && (
                          <div className="text-xs text-gray-500">GST: {owner.gstNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(owner.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getKycBadge(owner.kycStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900">
                            {owner._count?.stations || 0} stations
                          </div>
                          <div className="text-xs text-gray-500">
                            {owner._count?.supportTickets || 0} tickets
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col gap-2">
                          {owner.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(owner.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(owner.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {owner.status === 'active' && (
                            <button
                              onClick={() => handleSuspend(owner.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Suspend
                            </button>
                          )}
                          {owner.status === 'suspended' && (
                            <button
                              onClick={() => handleApprove(owner.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(owner.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{page}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
