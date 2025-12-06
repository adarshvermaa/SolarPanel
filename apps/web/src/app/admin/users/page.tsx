'use client';

import React from 'react';
import { useApi } from '../../../hooks/useApi';
import { useMutation } from '../../../hooks/useMutation';
import { DataTable } from '../../../components/ui/DataTable';
import { toast } from 'react-hot-toast';

export default function AdminUsersPage() {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [search, setSearch] = React.useState('');

    // Query string
    const queryString = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    const { data: responseData, loading, refetch } = useApi(`/users${queryString}`);

    const users = Array.isArray(responseData) ? responseData : responseData?.data || [];
    const totalItems = responseData?.meta?.total || 0;

    const { mutate: deleteUser } = useMutation('delete', {
        onSuccess: () => {
            refetch();
            toast.success('User deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete user');
        }
    });
    const { mutate: updateUser } = useMutation('patch', {
        onSuccess: () => {
            refetch();
            toast.success('User role updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update user role');
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
        <div className="max-w-7xl mx-auto py-8">
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Manage user accounts, roles, and permissions
                    </p>
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
        </div>
    );
}
