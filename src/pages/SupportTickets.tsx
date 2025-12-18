import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { adminApi, SupportTicket } from '../services/api';

export default function SupportTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [currentPage, statusFilter, categoryFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getTickets(currentPage, {
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
        priority: priorityFilter || undefined,
      });
      setTickets(response.tickets || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      await adminApi.updateTicket(ticketId, { status: newStatus });
      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update ticket status');
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    
    try {
      setSendingReply(true);
      await adminApi.addTicketReply(selectedTicket.id, replyMessage, isInternal);
      setReplyMessage('');
      setIsInternal(false);
      // Refresh ticket details
      const response = await adminApi.getTickets(1, { status: selectedTicket.status });
      const updatedTicket = response.tickets?.find(t => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
      fetchTickets();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return badges[priority] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      technical: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      billing: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      station_issue: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      general: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[category] || icons.general;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col ml-64">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Tickets</h1>
            <p className="text-gray-600">Manage and respond to support requests from station owners</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Tickets</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {tickets.filter(t => t.status === 'open').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {tickets.filter(t => t.status === 'in_progress').length}
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
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {tickets.filter(t => t.status === 'resolved').length}
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
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">
                    {tickets.filter(t => t.priority === 'urgent').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-wrap gap-4">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="station_issue">Station Issue</option>
                <option value="general">General</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                aria-label="Filter by priority"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ticket</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Category</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Priority</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Created</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                          <span className="ml-3">Loading tickets...</span>
                        </div>
                      </td>
                    </tr>
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No support tickets found
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { setSelectedTicket(ticket); setShowModal(true); }}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-sky-600">{ticket.ticketNumber}</div>
                            <div className="text-sm text-gray-900 truncate max-w-xs">{ticket.subject}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{ticket.owner?.name || '-'}</div>
                          <div className="text-xs text-gray-500">{ticket.owner?.email}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center text-gray-600">
                            {getCategoryIcon(ticket.category)}
                            <span className="ml-2 text-sm capitalize">{ticket.category.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ticket.status)}`}>
                            {ticket.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setSelectedTicket(ticket); setShowModal(true); }}
                              className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg"
                              title="View Details"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                  Page {currentPage} of {totalPages}
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

      {/* Ticket Details Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden m-4 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTicket.ticketNumber}</h2>
                <p className="text-sm text-gray-500">{selectedTicket.subject}</p>
              </div>
              <button
                onClick={() => { setShowModal(false); setSelectedTicket(null); setReplyMessage(''); }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close ticket details"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Ticket Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <span className={`mt-1 inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Priority</p>
                  <span className={`mt-1 inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority.toUpperCase()}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-xs text-gray-500 uppercase">Category</label>
                  <p className="text-sm font-medium capitalize mt-1">{selectedTicket.category.replace('_', ' ')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-xs text-gray-500 uppercase">Created</label>
                  <p className="text-sm font-medium mt-1">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Owner Info */}
              {selectedTicket.owner && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Submitted By</h3>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mr-4">
                      <span className="text-sky-600 font-semibold">{selectedTicket.owner.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedTicket.owner.name}</p>
                      <p className="text-xs text-gray-500">{selectedTicket.owner.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Conversation */}
              {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Conversation</h3>
                  <div className="space-y-3">
                    {selectedTicket.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-lg ${
                          reply.isInternal
                            ? 'bg-yellow-50 border border-yellow-200'
                            : reply.createdByType === 'admin'
                            ? 'bg-sky-50 border border-sky-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">
                            {reply.createdByType === 'admin' ? 'Admin' : 'Owner'}
                            {reply.isInternal && ' (Internal Note)'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Actions */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTicket.status === 'open' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedTicket.id, 'in_progress')}
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-sm font-medium"
                    >
                      Start Progress
                    </button>
                  )}
                  {selectedTicket.status === 'in_progress' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedTicket.id, 'resolved')}
                        className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm font-medium"
                      >
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedTicket.id, 'open')}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm font-medium"
                      >
                        Reopen
                      </button>
                    </>
                  )}
                  {selectedTicket.status === 'resolved' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedTicket.id, 'closed')}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm font-medium"
                      >
                        Close Ticket
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedTicket.id, 'open')}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm font-medium"
                      >
                        Reopen
                      </button>
                    </>
                  )}
                  {selectedTicket.status === 'closed' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedTicket.id, 'open')}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm font-medium"
                    >
                      Reopen Ticket
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reply Form */}
            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center mt-2">
                    <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                      Internal note (only visible to admins)
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim() || sendingReply}
                  className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {sendingReply ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
