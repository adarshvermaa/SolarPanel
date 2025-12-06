'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '../../../../hooks/useApi';
import { useMutation } from '../../../../hooks/useMutation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function AgentInstallationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const { data: installationData, loading, error, refetch } = useApi(id ? `/installations/${id}` : null);

    // Simplified form state - only status and scheduled date
    const [status, setStatus] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');

    useEffect(() => {
        if (installationData) {
            setStatus(installationData.installation.status);
            setScheduledDate(
                installationData.installation.scheduledDate
                    ? new Date(installationData.installation.scheduledDate).toISOString().split('T')[0]
                    : ''
            );
        }
    }, [installationData]);

    const { mutate: updateInstallation, loading: updating } = useMutation('patch', {
        onSuccess: () => {
            toast.success('Installation updated successfully');
            refetch();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update installation');
        }
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateInstallation(`/installations/${id}`, {
            status,
            scheduledDate
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error || !installationData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-xl font-bold text-red-600">Error Loading Installation</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Could not find installation with ID {id}</p>
                <Link href="/agent/installations" className="mt-4 text-emerald-600 hover:text-emerald-500 underline">
                    Return to Installations
                </Link>
            </div>
        );
    }

    const { installation, application } = installationData;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/agent/installations"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Installations
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Update Installation Task
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Update the schedule and status for this installation
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sticky top-24">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Customer Details
                        </h3>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-gray-500 dark:text-gray-400 mb-1">Application Number</dt>
                                <dd className="font-medium text-gray-900 dark:text-white bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg inline-block">
                                    {application.applicationNumber}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500 dark:text-gray-400 mb-1">Customer Name</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">{application.applicantName}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500 dark:text-gray-400 mb-1">Phone</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    <a href={`tel:${application.applicantPhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                        {application.applicantPhone}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500 dark:text-gray-400 mb-1">Address</dt>
                                <dd className="text-gray-900 dark:text-white">
                                    {application.address}<br />
                                    {application.city}, {application.state}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500 dark:text-gray-400 mb-1">Requested Capacity</dt>
                                <dd className="font-semibold text-gray-900 dark:text-white">{application.requestedCapacity} kW</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Update Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
                            Update Installation Details
                        </h3>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            {/* Status Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Installation Status *
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 p-3 border transition-colors"
                                >
                                    <option value="scheduled">📅 Scheduled</option>
                                    <option value="in_progress">🔄 In Progress</option>
                                    <option value="completed">✅ Completed</option>
                                    <option value="cancelled">❌ Cancelled</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Update the current status of the installation
                                </p>
                            </div>

                            {/* Scheduled Date Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Scheduled Date *
                                </label>
                                <input
                                    type="date"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 p-3 border transition-colors"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    When is this installation scheduled to take place?
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-blue-800 dark:text-blue-200">
                                        <p className="font-medium mb-1">Quick Tip</p>
                                        <p>Make sure to call the customer before updating the scheduled date to confirm availability.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/agent/installations')}
                                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {updating ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        'Save Updates'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Current Installation Info */}
                    {installation.notes && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
                            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Previous Notes</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">{installation.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
