'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface Installation {
    id: number;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    scheduledDate: string | null;
    startDate: string | null;
    completionDate: string | null;
    notes: string | null;
}

interface Application {
    id: number;
    applicationNumber: string;
    applicantName: string;
    applicantPhone: string;
    address: string;
    city: string;
    state: string;
    requestedCapacity: string;
    status: string;
}

interface AssignedTask {
    application: Application;
    installation: Installation | null;
}

export default function AgentDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [statsEndpoint, setStatsEndpoint] = useState<string | null>(null);

    // Set stats endpoint once user is loaded
    useEffect(() => {
        if (user?.id) {
            console.log('Setting stats endpoint for user ID:', user.id);
            setStatsEndpoint(`/agents/${user.id}/stats`);
        }
    }, [user]);

    // Debug logging
    useEffect(() => {
        console.log('Agent Dashboard - Auth Loading:', authLoading);
        console.log('Agent Dashboard - User:', user);
        console.log('Agent Dashboard - User ID:', user?.id);
        console.log('Agent Dashboard - Stats Endpoint:', statsEndpoint);
    }, [user, authLoading, statsEndpoint]);

    // Fetch tasks and stats using useApi hook
    const { data: tasksData, loading: tasksLoading, error: tasksError } = useApi<AssignedTask[]>(
        user ? '/agents/my-applications' : null
    );
    const { data: statsData, loading: statsLoading, error: statsError } = useApi(statsEndpoint);

    // Debug stats
    useEffect(() => {
        console.log('Stats Data:', statsData);
        console.log('Stats Loading:', statsLoading);
        console.log('Stats Error:', statsError);
    }, [statsData, statsLoading, statsError]);

    const tasks = tasksData || [];
    const stats = statsData || {
        assignedApplications: 0,
        inProgressInstallations: 0,
        completedInstallations: 0,
    };

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'agent')) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'scheduled':
                return '📅';
            case 'in_progress':
                return '🔄';
            case 'completed':
                return '✅';
            case 'cancelled':
                return '❌';
            default:
                return '📋';
        }
    };

    // Show loading while auth is initializing
    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // If no user after auth loads, will redirect
    if (!user) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.fullName}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Here's an overview of your installation tasks
                </p>

                {/* Debug Info */}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statsLoading ? (
                    <>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                    </div>
                                    <div className="bg-gray-200 dark:bg-gray-700 h-14 w-14 rounded-lg"></div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium mb-1">Total Assigned</p>
                                    <p className="text-4xl font-bold">{stats.assignedApplications}</p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm font-medium mb-1">In Progress</p>
                                    <p className="text-4xl font-bold">{stats.inProgressInstallations}</p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium mb-1">Completed</p>
                                    <p className="text-4xl font-bold">{stats.completedInstallations}</p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/agent/installations"
                        className="flex items-center gap-3 p-4 rounded-lg border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors group"
                    >
                        <div className="bg-emerald-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">View All Tasks</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Manage all installations</p>
                        </div>
                    </Link>

                    <Link
                        href="/agent/installations?status=in_progress"
                        className="flex items-center gap-3 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors group"
                    >
                        <div className="bg-yellow-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Active Tasks</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Continue in-progress work</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Tasks ({tasks.length})
                    </h2>
                    {tasks.length > 3 && (
                        <Link
                            href="/agent/installations"
                            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                        >
                            View All →
                        </Link>
                    )}
                </div>

                {tasks.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No tasks assigned yet</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Check back later for new installation assignments</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.slice(0, 5).map((task) => (
                            <div
                                key={task.application.id}
                                className="border border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {task.application.applicationNumber}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.installation?.status || 'scheduled')}`}>
                                                {getStatusIcon(task.installation?.status || 'scheduled')} {task.installation?.status?.toUpperCase().replace('_', ' ') || 'SCHEDULED'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="font-medium text-gray-900 dark:text-white">{task.application.applicantName}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                <span>{task.application.city}, {task.application.state}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span>{task.application.requestedCapacity} kW</span>
                                            </div>

                                            {task.installation?.scheduledDate && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{new Date(task.installation.scheduledDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                                        <Link
                                            href={`/agent/installations/${task.installation?.id}`}
                                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-center whitespace-nowrap shadow-sm group-hover:shadow-md"
                                        >
                                            Update Task
                                        </Link>
                                        <a
                                            href={`tel:${task.application.applicantPhone}`}
                                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-center whitespace-nowrap shadow-sm"
                                        >
                                            📞 Call
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
