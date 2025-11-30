'use client';

import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import Link from 'next/link';
import gsap from 'gsap';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: applications, loading } = useApi('/applications');
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (!loading && listRef.current && applications?.length > 0) {
            gsap.fromTo(
                listRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [loading, applications]);

    return (
        <ProtectedRoute>
            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between mb-8">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                My Dashboard
                            </h2>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Link
                                href="/apply"
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                New Application
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                My Applications
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Track the status of your solar installation applications.
                            </p>
                        </div>
                        <ul ref={listRef} className="divide-y divide-gray-200">
                            {!applications || applications.length === 0 ? (
                                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                    You haven't submitted any applications yet.
                                </li>
                            ) : (
                                applications.map((app: any, index: number) => (
                                    <li key={app.id || `app-${index}`}>
                                        <Link href={`/applications/${app.id}`} className="block hover:bg-gray-50">
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-green-600 truncate">
                                                        Scheme #{app.schemeId}
                                                    </p>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                            {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:flex sm:justify-between">
                                                    <div className="sm:flex">
                                                        <p className="flex items-center text-sm text-gray-500">
                                                            Application #{app.applicationNumber}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                        <p>
                                                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}
