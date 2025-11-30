'use client';

import React, { useEffect, useRef } from 'react';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProtectedRoute from '../../components/ProtectedRoute';
import gsap from 'gsap';
import Link from 'next/link';

export default function UserInstallationsPage() {
    const { data: installations, loading } = useApi('/installations');
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && listRef.current && installations?.length > 0) {
            gsap.fromTo(
                listRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [loading, installations]);

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            My Installations
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Track the progress of your solar panel installations.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div ref={listRef} className="space-y-6">
                        {!installations || installations.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No installations found</h3>
                                <p className="mt-1 text-sm text-gray-500">You don't have any active installations yet.</p>
                                <div className="mt-6">
                                    <Link
                                        href="/apply"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Apply for New Installation
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            installations.map((item: any) => (
                                <div key={item.installation.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Installation #{item.installation.id}
                                            </h3>
                                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                                Application #{item.application.applicationNumber}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                                            ${item.installation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                item.installation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    item.installation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                            {item.installation.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                        <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Scheduled Date</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {item.installation.scheduledDate ? new Date(item.installation.scheduledDate).toLocaleDateString() : 'Not scheduled yet'}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Installer</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {item.installer?.fullName || 'Pending Assignment'}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">System Details</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {item.installation.actualCapacity ? `${item.installation.actualCapacity} kW Capacity` : 'Capacity TBD'}
                                                    {item.installation.panelCount && ` • ${item.installation.panelCount} Panels`}
                                                </dd>
                                            </div>
                                            {item.installation.notes && (
                                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        {item.installation.notes}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
