import { useState, useEffect } from 'react';
import { Search, Loader, Trash2, User, CreditCard, XCircle } from 'lucide-react';
import { adminApi } from '../services/api';

export default function Users() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Subscription Modal State
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getUsers(currentPage, 20, searchTerm);
            setUsers(response.users || []);
            setTotalPages(response.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchUsers();
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY DELETE this user? This action cannot be undone.')) return;
        try {
            await adminApi.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleAssignPlan = async () => {
        if (!selectedUser || !selectedPlan) return;
        try {
            // Calculate end date based on plan (example: 30 days)
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30);

            await adminApi.updateUser(selectedUser.id, {
                subscriptionType: selectedPlan,
                subscriptionEndsAt: endDate.toISOString()
            });

            fetchUsers();
            setShowPlanModal(false);
            setSelectedUser(null);
            setSelectedPlan('');
        } catch (error) {
            console.error('Failed to assign plan:', error);
            alert('Failed to update subscription');
        }
    };

    const handleRemovePlan = async (user: any) => {
        if (!confirm('Remove subscription for this user?')) return;
        try {
            await adminApi.updateUser(user.id, {
                subscriptionType: '',
                subscriptionEndsAt: '' // API will handle empty or logic to nullify
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to remove plan:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Users</h1>
                    <p className="text-slate-500 mt-1">Manage registered application users.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center border border-white/60 shadow-sm bg-white/50">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users by name, email, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <button
                    onClick={handleSearch}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-primary-500/20 whitespace-nowrap"
                >
                    Search
                </button>
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl overflow-hidden border border-white/60 shadow-sm bg-white/50">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                            <p className="text-slate-500">Loading users...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            No users found.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/50 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                    <th className="p-6">User Info</th>
                                    <th className="p-6">Contact</th>
                                    <th className="p-6">Role</th>
                                    <th className="p-6">Subscription</th>
                                    <th className="p-6">Joined Date</th>
                                    <th className="p-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                                    {user.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{user.name}</p>
                                                    <p className="text-xs text-slate-500">ID: {user.id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-slate-600 text-sm">{user.email}</p>
                                            <p className="text-slate-400 text-xs">{user.phone || 'No phone'}</p>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium border bg-slate-100 text-slate-600 border-slate-200 uppercase tracking-wider">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            {user.subscriptionType ? (
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-purple-50 text-purple-600 border-purple-200 uppercase tracking-wider">
                                                        {user.subscriptionType}
                                                    </span>
                                                    {user.subscriptionEndsAt && (
                                                        <span className="text-[10px] text-slate-400">
                                                            Exp: {new Date(user.subscriptionEndsAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-sm italic">Free / None</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-slate-500 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => { setSelectedUser(user); setShowPlanModal(true); }}
                                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    title="Manage Subscription"
                                                >
                                                    <CreditCard className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
                    <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-600 font-medium transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-600 font-medium transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Plan Assignment Modal */}
            {showPlanModal && selectedUser && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-md rounded-2xl animate-fade-in border border-white/60 bg-white shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Manage Subscription</h3>
                            <button onClick={() => setShowPlanModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-600 text-sm">
                                Assign a subscription plan to <span className="font-bold text-slate-800">{selectedUser.name}</span>.
                            </p>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Plan</label>
                                <select
                                    value={selectedPlan}
                                    onChange={(e) => setSelectedPlan(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20"
                                >
                                    <option value="">Select a plan...</option>
                                    <option value="basic">Basic Plan (30 Days)</option>
                                    <option value="premium">Premium Plan (30 Days)</option>
                                    <option value="pro">Pro Plan (30 Days)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => handleRemovePlan(selectedUser)}
                                    className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors"
                                >
                                    Remove Plan
                                </button>
                                <button
                                    onClick={handleAssignPlan}
                                    disabled={!selectedPlan}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
                                >
                                    Assign Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
