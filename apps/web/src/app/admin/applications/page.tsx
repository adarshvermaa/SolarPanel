'use client';

import React from 'react';
import { useApi } from '../../../hooks/useApi';
import { useMutation } from '../../../hooks/useMutation';
import Link from 'next/link';
import { DataTable } from '../../../components/ui/DataTable';
import { toast } from 'react-hot-toast';

export default function AdminApplicationsPage() {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [search, setSearch] = React.useState('');

    // Query string
    const queryString = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    const { data: responseData, loading, refetch } = useApi(`/applications${queryString}`);

    const applications = Array.isArray(responseData) ? responseData : responseData?.data || [];
    const totalItems = responseData?.meta?.total || 0;

    const { mutate: updateStatus } = useMutation('patch', {
        onSuccess: () => {
            refetch();
            toast.success('Application status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update status');
        }
    });

    const handleStatusUpdate = async (id: number, status: string) => {
        if (confirm(`Are you sure you want to mark this application as ${status}?`)) {
            await updateStatus(`/applications/${id}/status`, { status });
        }
    };

    const columns = [
        {
            key: 'application.applicationNumber',
            header: 'App #',
            sortable: true,
            render: (item: any) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    {item.application.applicationNumber}
                </span>
            )
        },
        {
            key: 'application.applicantName',
            header: 'Applicant',
            sortable: true,
            render: (item: any) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.application.applicantName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.application.applicantEmail}</div>
                </div>
            )
        },
        {
            key: 'scheme.name',
            header: 'Scheme',
            sortable: true,
        },
        {
            key: 'application.status',
            header: 'Status',
            sortable: true,
            render: (item: any) => (
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 
                    ${item.application.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        item.application.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            item.application.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                    {item.application.status.toUpperCase()}
                </span>
            )
        },
        {
            key: 'application.createdAt',
            header: 'Date',
            sortable: true,
            render: (item: any) => new Date(item.application.createdAt).toLocaleDateString()
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (item: any) => (
                <div className="flex items-center gap-3 justify-end">
                    {item.application.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleStatusUpdate(item.application.id, 'approved')}
                                className="text-xs font-medium text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(item.application.id, 'rejected')}
                                className="text-xs font-medium text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Reject
                            </button>
                        </>
                    )}
                    <Link
                        href={`/admin/applications/${item.application.id}`}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/10 px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                        View
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applications</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Manage and track all solar installation applications
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    {/* Export button or other actions could go here */}
                </div>
            </div>

            <DataTable
                data={applications}
                columns={columns}
                loading={loading}
                isServerSide={true}
                totalItems={totalItems}
                onPageChange={(p) => setPage(p)}
                onSearchChange={(s) => { setSearch(s); setPage(1); }}
                onLimitChange={(l) => { setLimit(l); setPage(1); }}
                itemsPerPageOptions={[10, 20, 50]}
            />
        </div>
    );
}
