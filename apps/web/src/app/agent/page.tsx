'use client';

import { useApi } from '@/hooks/useApi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AgentDashboardPage() {
    const { data: stats, loading: statsLoading } = useApi('/stats/agent');
    const { data: assignments, loading: assignmentsLoading } = useApi('/agents/assignments');

    if (statsLoading || assignmentsLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Agent Dashboard
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Assignments
                        </h3>
                        <Wrench className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats?.assignments?.total || 0}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Pending
                        </h3>
                        <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats?.assignments?.pending || 0}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            In Progress
                        </h3>
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats?.assignments?.inProgress || 0}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Completed
                        </h3>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats?.assignments?.completed || 0}
                    </p>
                </div>
            </div>

            {/* Assignments List */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        My Assignments
                    </h2>
                </div>
                <div className="p-6">
                    {assignments && assignments.length > 0 ? (
                        <div className="space-y-4">
                            {assignments.map((assignment: any) => (
                                <div
                                    key={assignment.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {assignment.customerName}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {assignment.address}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                Capacity: {assignment.capacity}kW
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${assignment.status === 'completed'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                    : assignment.status === 'in_progress'
                                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                }`}
                                        >
                                            {assignment.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-2">
                                        Update Status →
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                No assignments yet. Check back later.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
