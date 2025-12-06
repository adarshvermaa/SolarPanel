'use client';

import React from 'react';
import { useApi } from '../../../hooks/useApi';
import { useMutation } from '../../../hooks/useMutation';
import Link from 'next/link';
import { DataTable } from '../../../components/ui/DataTable';
import { toast } from 'react-hot-toast';

export default function AgentInstallationsPage() {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [search, setSearch] = React.useState('');

    // Construct query string
    const queryString = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

    // Fetch data
    const { data: responseData, loading, refetch } = useApi(`/installations${queryString}`);

    // Extract data and meta
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
            sortable: true,
            render: (item: any) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    {item.application?.applicationNumber || 'N/A'}
                </span>
            )
        },
        {
            key: 'installation.status',
            header: 'Status',
            render: (item: any) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${item.installation?.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                        item.installation?.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'}`}>
                    {item.installation?.status.toUpperCase()}
                </span>
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
                        href={`/agent/installations/${item.installation.id}`}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/10 px-3 py-1.5 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                        Update Details
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Installations</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Manage your assigned installations
                    </p>
                </div>
            </div>

            <DataTable<any>
                data={installations}
                columns={columns}
                loading={loading}
                isServerSide={true}
                totalItems={totalItems}
                onPageChange={(newPage) => setPage(newPage)}
                onSearchChange={(newSearch) => {
                    setSearch(newSearch);
                    setPage(1);
                }}
                onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                }}
                itemsPerPageOptions={[10, 25, 50]}
                onRenderMobileItem={(item) => (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                                    #{item.application?.applicationNumber}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                                    {item.application?.applicantName}
                                </h3>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${item.installation?.status === 'completed'
                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                                : item.installation?.status === 'cancelled'
                                    ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                }`}>
                                {item.installation?.status?.toUpperCase()?.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{item.application?.address}, {item.application?.city}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>
                                    {item.installation?.scheduledDate
                                        ? new Date(item.installation.scheduledDate).toLocaleDateString()
                                        : 'Not scheduled'}
                                </span>
                            </div>
                        </div>

                        <Link
                            href={`/agent/installations/${item.installation.id}`}
                            className="block w-full text-center bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-medium py-2 rounded-lg transition-colors border border-gray-200 dark:border-slate-600"
                        >
                            View & Update Details
                        </Link>
                    </div>
                )}
            />
        </div>
    );
}
