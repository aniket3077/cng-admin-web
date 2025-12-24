import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { adminApi } from '../services/api';
import { Trash2, UserPlus, Shield } from 'lucide-react';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const ManageAdmins: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch admins
    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAdmins();
            setAdmins(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await adminApi.createAdmin(newAdmin);
            setShowAddModal(false);
            setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
            fetchAdmins();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to create admin');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleChange = async (id: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'superadmin' : 'admin';
        if (!window.confirm(`Are you sure you want to change role to ${newRole}?`)) return;

        try {
            await adminApi.updateAdmin(id, newRole);
            fetchAdmins();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to update user role');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;

        try {
            await adminApi.deleteAdmin(id);
            fetchAdmins();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to delete admin');
        }
    };

    return (
        <Layout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Manage Admins</h1>
                        <p className="text-gray-500">Create and manage administrator accounts and roles</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                    >
                        <UserPlus size={20} />
                        <span>Add Admin</span>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading users...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Name</th>
                                        <th className="px-6 py-4 font-semibold">Email</th>
                                        <th className="px-6 py-4 font-semibold">Role</th>
                                        <th className="px-6 py-4 font-semibold">Joined</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {admins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 font-medium text-gray-900">{admin.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${admin.role === 'superadmin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-blue-100 text-blue-800'}`}
                                                >
                                                    {admin.role === 'superadmin' && <Shield size={12} className="mr-1" />}
                                                    {admin.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(admin.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={() => handleRoleChange(admin.id, admin.role)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                >
                                                    {admin.role === 'admin' ? 'Promote' : 'Demote'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(admin.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                    title="Delete Admin"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {admins.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                No other admins found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add Admin Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 transform transition-all scale-100">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Administrator</h2>
                            <form onSubmit={handleCreate}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            placeholder="e.g. John Doe"
                                            value={newAdmin.name}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            placeholder="john@example.com"
                                            value={newAdmin.email}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            placeholder="Min. 6 characters"
                                            value={newAdmin.password}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            value={newAdmin.role}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="superadmin">Superadmin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg flex items-center justify-center disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ManageAdmins;
