'use client';

import React from 'react';
import { useApi } from '../../../hooks/useApi';
import { useMutation } from '../../../hooks/useMutation';
import Link from 'next/link';
import { DataTable } from '../../../components/ui/DataTable';
import { toast } from 'react-hot-toast';

export default function AdminInstallationsPage() {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [search, setSearch] = React.useState('');

    // Construct query string
    const queryString = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

    // Fetch data
    const { data: responseData, loading, refetch } = useApi(`/installations${queryString}`);

    // Extract data and meta
    // API returns { data: [...], meta: {...} } when paginated, or just [...] if not? 
    // Since we are passing pagination params, it returns object structure.
    const installations = Array.isArray(responseData) ? responseData : responseData?.data || [];
    const totalItems = responseData?.meta?.total || 0;

    const { mutate: updateInstallation } = useMutation('patch', {
        onSuccess: () => {
            refetch();
            toast.success('Installation status updated');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update status');
        }
    });

    const handleStatusChange = async (id: number, status: string) => {
        await updateInstallation(`/installations/${id}`, { status });
    };

    const columns = [
        {
            key: 'application.applicationNumber',
            header: 'App #',
            sortable: true, // Only client side sorting for now unless backend supports it
            render: (item: any) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    {item.application?.applicationNumber || 'N/A'}
                </span>
            )
        },
        {
            key: 'installer.fullName',
            header: 'Installer',
            sortable: true,
            render: (item: any) => (
                <div className="text-gray-900 dark:text-white">
                    {item.installer?.fullName || <span className="text-gray-400 italic">Unassigned</span>}
                </div>
            )
        },
        {
            key: 'installation.status',
            header: 'Status',
            render: (item: any) => (
                <select
                    value={item.installation?.status || 'scheduled'}
                    onChange={(e) => handleStatusChange(item.installation.id, e.target.value)}
                    className={`block w-full max-w-[140px] rounded-md border-gray-300 dark:border-gray-600 py-1 pl-2 pr-8 text-xs focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm 
                        ${item.installation?.status === 'completed' ? 'bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-300' :
                            item.installation?.status === 'cancelled' ? 'bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-300' :
                                'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'}`}
                >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            )
        },
        {
            key: 'installation.scheduledDate',
            header: 'Scheduled Date',
            sortable: true,
            render: (item: any) => (
                <span className="text-gray-500 dark:text-gray-400">
                    {item.installation?.scheduledDate ? new Date(item.installation.scheduledDate).toLocaleDateString() : <span className="text-gray-400">-</span>}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (item: any) => (
                <div className="flex justify-end">
                    <Link
                        href={`/admin/installations/${item.installation.id}`}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/10 px-3 py-1.5 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            )
        }
    ];

    // Filter out items without installation (just in case)
    // Actually with server side pagination we trust the server
    const tableData = installations;

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Installations</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Track progress and manage installer assignments
                    </p>
                </div>
            </div>

            <DataTable
                data={tableData}
                columns={columns}
                loading={loading}
                // Server-side props
                isServerSide={true}
                totalItems={totalItems}
                onPageChange={(newPage) => setPage(newPage)}
                onSearchChange={(newSearch) => {
                    setSearch(newSearch);
                    setPage(1); // Reset to page 1 on search
                }}
                onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1); // Reset to page 1 on limit change
                }}
                itemsPerPageOptions={[10, 25, 50]}
            />
        </div>
    );
}
