import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, SupportTicket } from '../services/api';

export default function SupportTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [page, statusFilter, categoryFilter, priorityFilter]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (categoryFilter) filters.category = categoryFilter;
      if (priorityFilter) filters.priority = priorityFilter;

      const data = await adminApi.getTickets(page, filters);
      setTickets(data.tickets);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      console.error('Error loading tickets:', error);
      alert(error.response?.data?.error || 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      await adminApi.updateTicket(ticketId, { status });
      alert('Ticket status updated');
      loadTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update ticket');
    }
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      await adminApi.addTicketReply(selectedTicket.id, replyMessage, isInternal);
      alert('Reply added successfully');
      setReplyMessage('');
      setIsInternal(false);
      // Refresh ticket details
      loadTickets();
      // Optionally reload the selected ticket details
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add reply');
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
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
        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex gap-4 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="station_issue">Station Issue</option>
              <option value="general">General</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No support tickets found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ticket.ticketNumber}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{ticket.subject}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ticket.owner?.name}</div>
                        <div className="text-xs text-gray-500">{ticket.owner?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {ticket.category.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
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

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                  <p className="text-sm text-gray-500">Ticket #{selectedTicket.ticketNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Ticket Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <p className={`font-semibold ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-sm font-medium capitalize">
                    {selectedTicket.category.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="text-sm font-medium">{selectedTicket.owner?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Station</p>
                  <p className="text-sm font-medium">{selectedTicket.station?.name || 'N/A'}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {/* Status Actions */}
              <div className="mb-6 flex gap-2 flex-wrap">
                {selectedTicket.status === 'open' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'in_progress')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Start Progress
                  </button>
                )}
                {selectedTicket.status === 'in_progress' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Mark Resolved
                  </button>
                )}
                {selectedTicket.status === 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'closed')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Close Ticket
                  </button>
                )}
                {selectedTicket.status !== 'open' && selectedTicket.status !== 'closed' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'open')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Reopen
                  </button>
                )}
              </div>

              {/* Replies */}
              {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Conversation</h3>
                  <div className="space-y-3">
                    {selectedTicket.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-lg ${
                          reply.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                        }`}
                      >
                        {reply.isInternal && (
                          <span className="text-xs font-semibold text-yellow-600 mb-2 block">
                            INTERNAL NOTE
                          </span>
                        )}
                        <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          {reply.createdBy} • {new Date(reply.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Reply Form */}
              <form onSubmit={handleAddReply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Reply
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your reply..."
                    required
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Internal Note (not visible to owner)</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send Reply
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
