import { useState, useEffect } from 'react';
import { adminApi, Withdrawal } from '../services/api';
import {
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Eye,
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  Phone
} from 'lucide-react';

export default function PayoutManagement() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState({
    totalPendingAmount: 0,
    pendingRequests: 0,
    completedPayouts: 0,
    rejectedRequests: 0,
    overdueRequests: 0,
  });
  
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  
  // Modal State
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPayouts();
  }, [pagination.page, statusFilter, showOverdueOnly]);

  const loadPayouts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPayouts(
        pagination.page,
        pagination.limit,
        {
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchQuery || undefined,
          overdue: showOverdueOnly || undefined,
        }
      );
      setWithdrawals(data.withdrawals || []);
      setStats(data.stats || {
        totalPendingAmount: 0,
        pendingRequests: 0,
        completedPayouts: 0,
        rejectedRequests: 0,
        overdueRequests: 0,
      });
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 1,
      }));
    } catch (error) {
      console.error('Failed to load payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadPayouts();
  };

  const handleExportCSV = async () => {
    try {
      const blob = await adminApi.exportPayouts({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
        overdue: showOverdueOnly || undefined,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payout_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export CSV report.');
    }
  };

  const handleUpdateStatus = async (id: string, targetStatus: 'processing' | 'paid' | 'rejected') => {
    if (targetStatus === 'rejected' && !adminRemarks.trim()) {
      alert('Please enter admin remarks explaining the rejection reason.');
      return;
    }

    if (!confirm(`Are you sure you want to mark this request as ${targetStatus.toUpperCase()}?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await adminApi.updatePayout(id, {
        status: targetStatus,
        adminRemarks: adminRemarks || null,
      });
      alert(`Withdrawal request updated to '${targetStatus}' successfully.`);
      setShowModal(false);
      setSelectedWithdrawal(null);
      setAdminRemarks('');
      await loadPayouts();
    } catch (error: any) {
      console.error('Action error:', error);
      alert(error.response?.data?.error || 'Failed to update withdrawal status.');
    } finally {
      setActionLoading(false);
    }
  };

  const openDetailsModal = (w: Withdrawal) => {
    setSelectedWithdrawal(w);
    setAdminRemarks(w.adminRemarks || '');
    setShowModal(true);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusBadge = (status: string, isOverdue = false) => {
    if (isOverdue && (status === 'pending' || status === 'processing')) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-red-100 text-red-700 animate-pulse">
          <AlertCircle className="w-3.5 h-3.5" /> Overdue
        </span>
      );
    }

    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-700">
            Pending
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700">
            Processing
          </span>
        );
      case 'paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-700">
            Paid
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden bg-white border border-slate-150 shadow-sm flex flex-col justify-between group">
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        <Icon className="w-20 h-20" />
      </div>
      <div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color.replace('text-', 'bg-').replace('500', '100')}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{loading ? '...' : value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Payout Management</h1>
          <p className="text-slate-500 mt-1">Review and process customer withdrawal requests manually.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button
            onClick={loadPayouts}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-md"
          >
            Refresh Payouts
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Pending"
          value={formatCurrency(stats.totalPendingAmount)}
          icon={Banknote}
          color="text-amber-600 bg-amber-500"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={Clock}
          color="text-blue-600 bg-blue-500"
        />
        <StatCard
          title="Completed Payouts"
          value={stats.completedPayouts}
          icon={CheckCircle}
          color="text-emerald-600 bg-emerald-500"
        />
        <StatCard
          title="Rejected Requests"
          value={stats.rejectedRequests}
          icon={XCircle}
          color="text-rose-600 bg-rose-500"
        />
        <StatCard
          title="Overdue Requests"
          value={stats.overdueRequests}
          icon={AlertCircle}
          color="text-red-600 bg-red-500"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, ID, UPI or account..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Overdue Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOverdueOnly}
              onChange={(e) => {
                setShowOverdueOnly(e.target.checked);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-600">Show Overdue (24h+)</span>
          </label>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Withdrawal ID</th>
                <th className="py-4 px-6">User Details</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Destination Details</th>
                <th className="py-4 px-6">Request Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                    Loading withdrawals...
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                    No withdrawal requests found matching the criteria.
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">
                      {w.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{w.userName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{w.userEmail}</div>
                      <div className="text-xs text-slate-400">{w.userMobile}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {formatCurrency(w.amount)}
                    </td>
                    <td className="py-4 px-6 font-medium capitalize">
                      {w.paymentMethod === 'upi' ? 'UPI' : 'Bank'}
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate">
                      {w.paymentMethod === 'upi' ? (
                        <div className="font-semibold text-slate-700">{w.upiId}</div>
                      ) : (
                        <div>
                          <div className="font-semibold text-slate-700">{w.bankName || 'Bank Account'}</div>
                          <div className="text-xs text-slate-400">A/C: {w.accountNumber}</div>
                          <div className="text-xs text-slate-400">IFSC: {w.ifscCode}</div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-700">{formatDate(w.requestedAt)}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Deadline: {formatDate(w.payoutDeadline)}</div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(w.status, w.isOverdue)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => openDetailsModal(w)}
                        className="p-2 text-primary-600 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors inline-flex items-center gap-1.5 font-semibold text-xs"
                      >
                        <Eye className="w-4 h-4" /> Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50">
            <span className="text-xs text-slate-500 font-semibold">
              Showing page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details & Actions Modal */}
      {showModal && selectedWithdrawal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Manage Withdrawal</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">ID: {selectedWithdrawal.id}</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedWithdrawal(null);
                  setAdminRemarks('');
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* User Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Name</div>
                      <div className="text-sm font-bold text-slate-800">{selectedWithdrawal.userName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Email</div>
                      <div className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{selectedWithdrawal.userEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Mobile</div>
                      <div className="text-sm font-bold text-slate-800">{selectedWithdrawal.userMobile}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Request Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Amount Requested:</span>
                      <span className="font-bold text-slate-800">{formatCurrency(selectedWithdrawal.amount)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Request Date:</span>
                      <span className="font-semibold text-slate-700">{formatDate(selectedWithdrawal.requestedAt)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Payout Deadline:</span>
                      <span className="font-semibold text-slate-700">{formatDate(selectedWithdrawal.payoutDeadline)}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Current Status:</span>
                      <span>{getStatusBadge(selectedWithdrawal.status, selectedWithdrawal.isOverdue)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payout Destination</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Method:</span>
                      <span className="font-bold uppercase text-slate-800">{selectedWithdrawal.paymentMethod === 'upi' ? 'UPI' : 'Bank'}</span>
                    </div>
                    {selectedWithdrawal.paymentMethod === 'upi' ? (
                      <div className="flex justify-between">
                        <span className="text-slate-500">UPI ID:</span>
                        <span className="font-bold text-primary-600">{selectedWithdrawal.upiId}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Bank Name:</span>
                          <span className="font-bold text-slate-800">{selectedWithdrawal.bankName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Account Number:</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedWithdrawal.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">IFSC Code:</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedWithdrawal.ifscCode}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Timestamps */}
              {(selectedWithdrawal.approvedAt || selectedWithdrawal.paidAt || selectedWithdrawal.rejectedAt) && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <div className="text-slate-400 font-semibold uppercase">Approved At</div>
                      <div className="font-bold text-slate-700 mt-0.5">{formatDate(selectedWithdrawal.approvedAt || '')}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-semibold uppercase">Paid At</div>
                      <div className="font-bold text-slate-700 mt-0.5">{formatDate(selectedWithdrawal.paidAt || '')}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-semibold uppercase">Rejected At</div>
                      <div className="font-bold text-slate-700 mt-0.5">{formatDate(selectedWithdrawal.rejectedAt || '')}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Remarks Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Admin Remarks</label>
                <textarea
                  placeholder="Enter remarks (reason for rejection, payment transaction ID, bank reference, etc.)"
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  disabled={selectedWithdrawal.status === 'paid' || selectedWithdrawal.status === 'rejected'}
                  className="w-full p-4 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500 h-24"
                />
              </div>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                disabled={actionLoading}
                onClick={() => {
                  setShowModal(false);
                  setSelectedWithdrawal(null);
                  setAdminRemarks('');
                }}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Close
              </button>

              {/* Action: Approve (Pending -> Processing) */}
              {selectedWithdrawal.status === 'pending' && (
                <>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedWithdrawal.id, 'rejected')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
                  >
                    Reject Request
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedWithdrawal.id, 'processing')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 shadow-md"
                  >
                    Approve & Process <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Action: Mark as Paid (Processing -> Paid) */}
              {selectedWithdrawal.status === 'processing' && (
                <>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedWithdrawal.id, 'rejected')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
                  >
                    Reject Request
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedWithdrawal.id, 'paid')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 shadow-md"
                  >
                    Mark as Paid
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
