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
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                                My Dashboard
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Welcome back! Track your solar installation applications below.
                            </p>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Link
                                href="/apply"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                ✨ New Application
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg transition-colors">
                        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                📋 My Applications
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                                Track the status of your solar installation applications.
                            </p>
                        </div>
                        <ul ref={listRef} className="divide-y divide-gray-200 dark:divide-gray-700">
                            {!applications || applications.length === 0 ? (
                                <li className="px-4 py-12 sm:px-6 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No applications yet</h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first solar installation application.</p>
                                        <div className="mt-6">
                                            <Link
                                                href="/apply"
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                Create Application
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ) : (
                                applications.map((item: any, index: number) => {
                                    const app = item.application || item;
                                    return (
                                        <li key={app.id || `app-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <Link href={`/applications/${app.id}`} className="block">
                                                <div className="px-4 py-4 sm:px-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0">
                                                                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                                                    <span className="text-green-600 dark:text-green-400 text-lg">☀️</span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                                                    Application #{app.applicationNumber}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Scheme #{app.schemeId}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                                                            <p className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                                app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                                                {(app.status || 'pending').charAt(0).toUpperCase() + (app.status || 'pending').slice(1)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 sm:flex sm:justify-between">
                                                        <div className="sm:flex">
                                                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                                </svg>
                                                                Applied on {new Date(app.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                            View Details
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}
