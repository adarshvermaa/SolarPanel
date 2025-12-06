'use client';

'use client';

import React from 'react';
import { useApi } from '../../../hooks/useApi';
import { useMutation } from '../../../hooks/useMutation';
import { DataTable } from '../../../components/ui/DataTable';
import { toast } from 'react-hot-toast';

import { createPortal } from 'react-dom';

export default function AdminUsersPage() {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [search, setSearch] = React.useState('');
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        password: '',
        role: 'user',
        isActive: true
    });

    // Query string
    const queryString = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    const { data: responseData, loading, refetch } = useApi(`/users${queryString}`);

    const users = Array.isArray(responseData) ? responseData : responseData?.data || [];
    const totalItems = responseData?.meta?.total || 0;

    const { mutate: createUser } = useMutation('post', {
        showErrorToast: false,
        onSuccess: () => {
            refetch();
            setIsModalOpen(false);
            setFormData({ fullName: '', email: '', password: '', role: 'user', isActive: true });
            toast.success('User created successfully');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message;
            const displayMessage = Array.isArray(message) ? message.join(', ') : (message || 'Failed to create user');
            toast.error(displayMessage);
        }
    });

    const { mutate: deleteUser } = useMutation('delete', {
        showErrorToast: false,
        onSuccess: () => {
            refetch();
            toast.success('User deleted successfully');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message;
            const displayMessage = Array.isArray(message) ? message.join(', ') : (message || 'Failed to delete user');
            toast.error(displayMessage);
        }
    });
    const { mutate: updateUser } = useMutation('patch', {
        showErrorToast: false,
        onSuccess: () => {
            refetch();
            toast.success('User role updated successfully');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message;
            const displayMessage = Array.isArray(message) ? message.join(', ') : (message || 'Failed to update user role');
            toast.error(displayMessage);
        }
    });

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            await deleteUser(`/users/${id}`);
        }
    };

    const handleRoleChange = async (id: number, newRole: string) => {
        await updateUser(`/users/${id}`, { role: newRole });
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createUser('/users', formData);
    };

    const columns = [
        {
            key: 'fullName',
            header: 'Name',
            sortable: true,
            render: (item: any) => (
                <span className="font-medium text-gray-900 dark:text-white">{item.fullName}</span>
            )
        },
        {
            key: 'email',
            header: 'Email',
            sortable: true,
            render: (item: any) => (
                <span className="text-gray-900 dark:text-gray-300">{item.email}</span>
            )
        },
        {
            key: 'role',
            header: 'Role',
            sortable: true,
            render: (item: any) => (
                <select
                    value={item.role}
                    onChange={(e) => handleRoleChange(item.id, e.target.value)}
                    className="block w-full max-w-[120px] rounded-md border-gray-300 dark:border-gray-600 py-1 pl-2 pr-8 text-xs focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                    <option value="installer">Installer</option>
                </select>
            )
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (item: any) => (
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${item.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (item: any) => (
                <div className="flex justify-end">
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-xs font-medium"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center justify-between mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Manage user accounts, roles, and permissions
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        type="button"
                        onClick={() => {
                            console.log('Add User button clicked');
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto cursor-pointer"
                    >
                        Add User
                    </button>
                </div>
            </div>

            <DataTable
                data={users}
                columns={columns}
                loading={loading}
                isServerSide={true}
                totalItems={totalItems}
                onPageChange={(p) => setPage(p)}
                onSearchChange={(s) => { setSearch(s); setPage(1); }}
                onLimitChange={(l) => { setLimit(l); setPage(1); }}
                itemsPerPageOptions={[10, 25, 50]}
            />

            {/* Create User Modal */}
            {isModalOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

                        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-gray-700">
                            <form onSubmit={handleCreateSubmit}>
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                                Add New User
                                            </h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        id="fullName"
                                                        required
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm dark:bg-gray-700 dark:text-white p-2 border"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        required
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm dark:bg-gray-700 dark:text-white p-2 border"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        required
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm dark:bg-gray-700 dark:text-white p-2 border"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Role
                                                    </label>
                                                    <select
                                                        id="role"
                                                        name="role"
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm dark:bg-gray-700 dark:text-white p-2 border"
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="agent">Agent</option>
                                                        <option value="installer">Installer</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Create User
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
