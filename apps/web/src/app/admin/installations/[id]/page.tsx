'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApi } from '../../../../hooks/useApi';
import Link from 'next/link';

export default function InstallationDetailsPage() {
    const params = useParams();
    const id = params.id;

    // Fetch data
    const { data: installationData, loading, error } = useApi(id ? `/installations/${id}` : null);

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
                <p className="mt-2 text-gray-600">Could not find installation with ID {id}</p>
                <Link href="/admin/installations" className="mt-4 text-emerald-600 hover:text-emerald-500 underline">
                    Return to List
                </Link>
            </div>
        );
    }

    const { installation, application, installer } = installationData;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/installations" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            ← Back
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Installation #{installation.id}
                        </h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                            ${installation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                installation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'}`}>
                            {installation.status.toUpperCase()}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Application: {application.applicationNumber} • Installer: {installer?.fullName || 'Unassigned'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Application Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Details</h3>
                        <dl className="space-y-3 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="text-gray-500 dark:text-gray-400">Name:</dt>
                                <dd className="col-span-2 text-gray-900 dark:text-gray-200 font-medium">{application.applicantName}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="text-gray-500 dark:text-gray-400">Email:</dt>
                                <dd className="col-span-2 text-gray-900 dark:text-gray-200">{application.applicantEmail}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <dt className="text-gray-500 dark:text-gray-400">Phone:</dt>
                                <dd className="col-span-2 text-gray-900 dark:text-gray-200">{application.applicantPhone}</dd>
                            </div>
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
                                <dt className="text-gray-500 dark:text-gray-400 mb-1">Installation Address:</dt>
                                <dd className="text-gray-900 dark:text-gray-200">
                                    {application.address}<br />
                                    {application.city}, {application.state}<br />
                                    {application.pincode}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application Spec</h3>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                                <dt className="text-gray-500 dark:text-gray-400">Requested Capacity</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">{application.requestedCapacity} kW</dd>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                                <dt className="text-gray-500 dark:text-gray-400">Property Type</dt>
                                <dd className="text-gray-900 dark:text-white">{application.propertyType}</dd>
                            </div>
                            <div className="flex justify-between pt-2">
                                <dt className="text-gray-500 dark:text-gray-400">Roof Area</dt>
                                <dd className="text-gray-900 dark:text-white">{application.roofArea} sq ft</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Installation Info (Read Only) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                            Installation Details
                        </h3>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{installation.status.replace('_', ' ')}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {installation.scheduledDate ? new Date(installation.scheduledDate).toLocaleDateString() : 'Not Scheduled'}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Actual Capacity</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {installation.actualCapacity ? `${installation.actualCapacity} kW` : '-'}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Inverter Capacity</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {installation.inverterCapacity ? `${installation.inverterCapacity} kW` : '-'}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                                    {installation.notes || 'No notes available'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Timestamps</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">Created At</span>
                                <span className="text-gray-900 dark:text-white">
                                    {new Date(installation.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">Last Updated</span>
                                <span className="text-gray-900 dark:text-white">
                                    {new Date(installation.updatedAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
