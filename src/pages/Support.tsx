import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Loader, MessageSquare, Search, Send, ShieldAlert, XCircle } from 'lucide-react';
import { adminApi, SupportTicket } from '../services/api';

const statusOptions = ['', 'open', 'in_progress', 'resolved', 'closed'];
const priorityOptions = ['', 'low', 'medium', 'high'];
const categoryOptions = ['', 'technical', 'billing', 'station', 'account', 'general'];

export default function Support() {
  const [searchParams] = useSearchParams();
  const statusQuery = searchParams.get('status') || '';

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(statusQuery);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusDraft, setStatusDraft] = useState('open');
  const [priorityDraft, setPriorityDraft] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [resolution, setResolution] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyInternal, setReplyInternal] = useState(false);

  useEffect(() => {
    setStatusFilter(statusQuery);
    setCurrentPage(1);
  }, [statusQuery]);

  useEffect(() => {
    fetchTickets();
  }, [currentPage, statusFilter, categoryFilter, priorityFilter]);

  useEffect(() => {
    if (!selectedTicket) {
      return;
    }

    setStatusDraft(selectedTicket.status || 'open');
    setPriorityDraft(selectedTicket.priority || 'medium');
    setAssignedTo(selectedTicket.assignedTo || '');
    setResolution(selectedTicket.resolution || '');
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getTickets(currentPage, {
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
        priority: priorityFilter || undefined,
        search: searchTerm || undefined,
      });

      setTickets(response.tickets || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTickets();
  };

  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) {
      return;
    }

    try {
      setSaving(true);
      const response = await adminApi.updateTicket(selectedTicket.id, {
        status: statusDraft,
        priority: priorityDraft,
        assignedTo: assignedTo.trim() || undefined,
        resolution: resolution.trim() || undefined,
      });

      if (response.ticket) {
        setSelectedTicket(response.ticket);
      }

      await fetchTickets();
    } catch (error) {
      console.error('Error updating support ticket:', error);
      alert('Failed to update ticket.');
    } finally {
      setSaving(false);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) {
      return;
    }

    try {
      setSaving(true);
      const response = await adminApi.addTicketReply(selectedTicket.id, replyMessage.trim(), replyInternal);
      const updatedReplies = [...(selectedTicket.replies || []), response.reply];
      const updatedStatus = selectedTicket.status === 'open' ? 'in_progress' : selectedTicket.status;

      setSelectedTicket({
        ...selectedTicket,
        status: updatedStatus,
        replies: updatedReplies,
      });
      setReplyMessage('');
      setReplyInternal(false);
      await fetchTickets();
    } catch (error) {
      console.error('Error replying to support ticket:', error);
      alert('Failed to send reply.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: 'bg-amber-100 text-amber-700 border-amber-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      closed: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return `px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.open}`;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-slate-100 text-slate-700 border-slate-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      high: 'bg-red-100 text-red-700 border-red-200',
    };

    return `px-2.5 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-wide ${styles[priority] || styles.medium}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Support Tickets</h1>
          <p className="text-slate-500 mt-1">Track, reply to, and resolve customer support issues.</p>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center border border-white/60 shadow-sm bg-white/50">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject, ticket number, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-2.5 pl-4 pr-10 text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none cursor-pointer min-w-[150px]"
          >
            {statusOptions.map((status) => (
              <option key={status || 'all-status'} value={status}>
                {status ? status.replace('_', ' ') : 'All Status'}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-2.5 pl-4 pr-10 text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none cursor-pointer min-w-[150px]"
          >
            {categoryOptions.map((category) => (
              <option key={category || 'all-category'} value={category}>
                {category || 'All Categories'}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-2.5 pl-4 pr-10 text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none cursor-pointer min-w-[140px]"
          >
            {priorityOptions.map((priority) => (
              <option key={priority || 'all-priority'} value={priority}>
                {priority || 'All Priority'}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-primary-500/20 whitespace-nowrap"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-white/60 shadow-sm bg-white/50">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-10 h-10 text-primary-500 animate-spin mb-4" />
              <p className="text-slate-500">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No support tickets found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="p-6">Ticket</th>
                  <th className="p-6">Owner</th>
                  <th className="p-6">Category</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Created</th>
                  <th className="p-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">{ticket.subject}</p>
                        <p className="text-xs text-slate-500">{ticket.ticketNumber}</p>
                        <p className="text-sm text-slate-500 line-clamp-1">{ticket.description}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-slate-700 font-medium">{ticket.owner?.name || 'Guest / Unlinked'}</p>
                      <p className="text-xs text-slate-500">{ticket.owner?.email || 'No email available'}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-2 items-start">
                        <span className="text-sm text-slate-700 capitalize">{ticket.category}</span>
                        <span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={getStatusBadge(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-6 text-slate-500 text-sm">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => handleOpenTicket(ticket)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View Ticket"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
            <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-600 font-medium transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-600 font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl animate-fade-in border border-white/60 bg-white shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedTicket.subject}</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedTicket.ticketNumber}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close Modal"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Ticket Details</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-medium text-slate-800">Category:</span> {selectedTicket.category}</p>
                    <p><span className="font-medium text-slate-800">Created:</span> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                    <p><span className="font-medium text-slate-800">Station:</span> {selectedTicket.station?.name || 'Not linked'}</p>
                    <p><span className="font-medium text-slate-800">Owner:</span> {selectedTicket.owner?.name || 'Not linked'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Current Status</h3>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className={getStatusBadge(selectedTicket.status)}>{selectedTicket.status.replace('_', ' ')}</span>
                    <span className={getPriorityBadge(selectedTicket.priority)}>{selectedTicket.priority}</span>
                    {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {selectedTicket.replies.length} replies
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Description</label>
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-700 whitespace-pre-wrap">
                  {selectedTicket.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Status</label>
                    <select
                      value={statusDraft}
                      onChange={(e) => setStatusDraft(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    >
                      {statusOptions.filter(Boolean).map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Priority</label>
                    <select
                      value={priorityDraft}
                      onChange={(e) => setPriorityDraft(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    >
                      {priorityOptions.filter(Boolean).map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Assigned To</label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="Admin name or team"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Resolution Notes</label>
                  <textarea
                    rows={8}
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Add the resolution summary or next steps..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUpdateTicket}
                  disabled={saving}
                  className="px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-500/20"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-primary-500" />
                  <h3 className="text-sm font-bold text-slate-800">Conversation</h3>
                </div>

                {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTicket.replies.map((reply) => (
                      <div key={reply.id} className={`p-4 rounded-xl border ${reply.isInternal ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between items-center gap-4 mb-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{reply.createdBy}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">{reply.createdByType}</p>
                          </div>
                          <div className="text-right">
                            {reply.isInternal && (
                              <span className="inline-flex mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700">
                                Internal note
                              </span>
                            )}
                            <p className="text-xs text-slate-400">{new Date(reply.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    No replies yet.
                  </div>
                )}

                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write a reply or internal note..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                  />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={replyInternal}
                        onChange={(e) => setReplyInternal(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                      />
                      Add as internal note
                    </label>

                    <button
                      onClick={handleReply}
                      disabled={saving || !replyMessage.trim()}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
