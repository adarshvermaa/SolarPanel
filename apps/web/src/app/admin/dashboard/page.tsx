'use client';

import React, { useEffect, useRef } from 'react';
import { useApi } from '../../../hooks/useApi';
import Link from 'next/link';
import gsap from 'gsap';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

export default function AdminDashboardPage() {
    const { data: stats, loading } = useApi('/admin/dashboard');
    const statsRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (!loading && statsRef.current) {
            const cards = statsRef.current.querySelectorAll('.stat-card');
            gsap.fromTo(
                cards,
                { opacity: 0, y: 30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }
            );
        }
    }, [loading]);

    useEffect(() => {
        if (!loading && listRef.current && stats?.recentApplications?.length > 0) {
            gsap.fromTo(
                listRef.current.children,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
            );
        }
    }, [loading, stats]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-8 text-center text-gray-500">
                Failed to load dashboard data
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl mb-8">
                Admin Dashboard
            </h2>

            {/* Stats Grid */}
            <div ref={statsRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="stat-card bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Users</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.stats?.totalUsers || 0}</dd>
                    </div>
                </div>
                <div className="stat-card bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Applications</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.stats?.totalApplications || 0}</dd>
                    </div>
                </div>
                <div className="stat-card bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Schemes</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.stats?.totalSchemes || 0}</dd>
                    </div>
                </div>
                <div className="stat-card bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Installations</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.stats?.totalInstallations || 0}</dd>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Link
                    href="/admin/agents"
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg shadow-lg p-6 transition-all transform hover:scale-105"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg">Agent Management</h3>
                            <p className="text-emerald-100 text-sm">Assign tasks to installers</p>
                        </div>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Link>

                <Link
                    href="/admin/applications"
                    className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-lg p-6 transition-all transform hover:scale-105"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg">Applications</h3>
                            <p className="text-blue-100 text-sm">Review pending applications</p>
                        </div>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Link>

                <Link
                    href="/admin/schemes"
                    className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg shadow-lg p-6 transition-all transform hover:scale-105"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg">Schemes</h3>
                            <p className="text-purple-100 text-sm">Manage solar schemes</p>
                        </div>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Link>
            </div>

            {/* Recent Applications */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Applications</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Latest submissions requiring review.</p>
                    </div>
                    <Link href="/admin/applications" className="text-green-600 hover:text-green-800 text-sm font-medium">
                        View All
                    </Link>
                </div>
                <ul ref={listRef} className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats?.recentApplications?.map((app: any) => (
                        <li key={app.id}>
                            <Link href={`/admin/applications/${app.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400 truncate">
                                            Application #{app.applicationNumber}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                {app.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                {app.applicantName}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                            <p>Submitted on {new Date(app.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
