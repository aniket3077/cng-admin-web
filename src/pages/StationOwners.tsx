import { useState, useEffect } from 'react';
import { Search, Loader, CheckCircle, XCircle, Eye, Shield, Trash2, Ban } from 'lucide-react';
import { adminApi } from '../services/api';

export default function StationOwners() {
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kycFilter, setKycFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      if (selectedOwner?.id === ownerId) setShowModal(false);
    } catch (error) {
      console.error('Failed to approve owner:', error);
    }
  };



  const handleSuspend = async (ownerId: string) => {
    if (!confirm('Are you sure you want to suspend this owner? This will disable all their stations.')) return;
    try {
      await adminApi.updateOwner(ownerId, { status: 'suspended' });
      fetchOwners();
      if (selectedOwner?.id === ownerId) setShowModal(false);
    } catch (error) {
      console.error('Failed to suspend owner:', error);
    }
  };

  const handleDelete = async (ownerId: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY DELETE this owner? This action cannot be undone.')) return;
    try {
      await adminApi.deleteOwner(ownerId);
      fetchOwners();
      if (selectedOwner?.id === ownerId) setShowModal(false);
    } catch (error) {
      console.error('Failed to delete owner:', error);
    }
  };

  const handleVerifyKYC = async (ownerId: string) => {
    try {
      await adminApi.updateOwner(ownerId, { kycStatus: 'verified' });
      fetchOwners();
      if (selectedOwner?.id === ownerId) setShowModal(false);
    } catch (error) { console.error(error); }
  };

  const handleRejectKYC = async (ownerId: string) => {
    const reason = prompt('Enter KYC rejection reason:');
    if (!reason) return;
    try {
      await adminApi.updateOwner(ownerId, { kycStatus: 'rejected', kycRejectionReason: reason });
      fetchOwners();
      if (selectedOwner?.id === ownerId) setShowModal(false);
    } catch (error) { console.error(error); }
  };


  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      suspended: 'bg-red-500/10 text-red-500 border-red-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return `px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-700 text-slate-300'}`;
  };

  const getKycBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
      not_submitted: 'text-slate-400 bg-slate-400/10 border-slate-400/20'
    };
    return `px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${styles[status] || styles.not_submitted}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Station Owners</h1>
          <p className="text-slate-400 mt-1">Manage registered station owners and businesses.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search owners by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-primary-500/50"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border-none rounded-lg py-2.5 pl-4 pr-10 text-slate-200 focus:ring-2 focus:ring-primary-500/50 cursor-pointer min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="bg-slate-800 border-none rounded-lg py-2.5 pl-4 pr-10 text-slate-200 focus:ring-2 focus:ring-primary-500/50 cursor-pointer min-w-[140px]"
          >
            <option value="">All KYC</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="not_submitted">Not Submitted</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20 whitespace-nowrap"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-10 h-10 text-primary-500 animate-spin mb-4" />
              <p className="text-slate-400">Loading owners...</p>
            </div>
          ) : owners.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No station owners found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                  <th className="p-6">Owner Profile</th>
                  <th className="p-6">Contact Info</th>
                  <th className="p-6">Status & KYC</th>
                  <th className="p-6">Joined Date</th>
                  <th className="p-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {owners.map((owner) => (
                  <tr key={owner.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-600">
                          {owner.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{owner.name}</p>
                          <p className="text-xs text-slate-500">{owner.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-slate-300 text-sm">{owner.phone}</p>
                      <p className="text-slate-500 text-xs">{owner.address || 'No address'}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={getStatusBadge(owner.status)}>
                          {owner.status}
                        </span>
                        <span className={getKycBadge(owner.kycStatus)}>
                          KYC: {owner.kycStatus?.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-slate-400 text-sm">
                      {new Date(owner.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setSelectedOwner(owner); setShowModal(true); }}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Quick Actions if essential, otherwise keep in modal to reduce clutter */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/50">
            <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-300 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-300 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Owner Details Modal */}
      {showModal && selectedOwner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl animate-fade-in border border-slate-700">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center sticky top-0 bg-slate-900/90 backdrop-blur z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center text-sm font-bold">
                  {selectedOwner.name?.charAt(0)}
                </div>
                {selectedOwner.name}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Account Status Section */}
              <div className="flex gap-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Account Status</label>
                  <div><span className={getStatusBadge(selectedOwner.status)}>{selectedOwner.status}</span></div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">KYC Status</label>
                  <div><span className={getKycBadge(selectedOwner.kycStatus)}>{selectedOwner.kycStatus?.replace('_', ' ')}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Business Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Company Name</label>
                      <p className="text-slate-200">{selectedOwner.companyName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Business Type</label>
                      <p className="text-slate-200">{selectedOwner.businessType || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Tax ID / GST</label>
                      <p className="text-slate-200">{selectedOwner.taxId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Address</label>
                      <p className="text-slate-200">{selectedOwner.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Contact Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Email</label>
                      <p className="text-slate-200">{selectedOwner.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Phone</label>
                      <p className="text-slate-200">{selectedOwner.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2 mb-4">KYC Documents</h3>
                {selectedOwner.kycDocuments && selectedOwner.kycDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedOwner.kycDocuments.map((doc: any, index: number) => (
                      <div key={index} className="p-3 bg-slate-800 rounded-lg flex items-center justify-between border border-slate-700">
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-primary-500" />
                          <span className="text-sm text-slate-300 capitalize">{doc.type.replace('_', ' ')}</span>
                        </div>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-400 hover:text-primary-300 font-medium hover:underline">View</a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">No KYC documents submitted.</p>
                )}
              </div>

              {/* Actions Panel */}
              <div className="pt-6 border-t border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-white mb-2">Administrative Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedOwner.status === 'pending' || selectedOwner.status === 'suspended' ? (
                    <button onClick={() => handleApprove(selectedOwner.id)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20">
                      <CheckCircle className="w-4 h-4" /> Activate Owner
                    </button>
                  ) : (
                    <button onClick={() => handleSuspend(selectedOwner.id)} className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors border border-orange-500/20">
                      <Ban className="w-4 h-4" /> Suspend Owner
                    </button>
                  )}

                  {selectedOwner.kycStatus === 'pending' && (
                    <>
                      <button onClick={() => handleVerifyKYC(selectedOwner.id)} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20">
                        <Shield className="w-4 h-4" /> Verify KYC
                      </button>
                      <button onClick={() => handleRejectKYC(selectedOwner.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
                        <XCircle className="w-4 h-4" /> Reject KYC
                      </button>
                    </>
                  )}

                  <button onClick={() => handleDelete(selectedOwner.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20 ml-auto">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
