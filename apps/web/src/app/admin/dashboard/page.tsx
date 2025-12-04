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
