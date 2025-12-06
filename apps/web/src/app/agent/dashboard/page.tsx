'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

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
    const { user, token } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<AssignedTask[]>([]);
    const [stats, setStats] = useState({
        assignedApplications: 0,
        inProgressInstallations: 0,
        completedInstallations: 0,
    });
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<AssignedTask | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<string>('');
    const [updateNotes, setUpdateNotes] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'agent') {
            router.push('/dashboard');
            return;
        }
        fetchData();
    }, [user, router]);

    const fetchData = async () => {
        try {
            // Fetch assigned applications
            const tasksResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/agents/my-applications`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            const tasksData = await tasksResponse.json();
            setTasks(tasksData);

            // Fetch stats
            const statsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/agents/${user?.id}/stats`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            const statsData = await statsResponse.json();
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedTask?.installation || !newStatus) return;

        setIsUpdating(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/agents/installations/${selectedTask.installation.id}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: newStatus,
                        notes: updateNotes,
                    }),
                }
            );

            if (response.ok) {
                await fetchData();
                setUpdateModalOpen(false);
                setSelectedTask(null);
                setNewStatus('');
                setUpdateNotes('');
                toast.success('Status updated successfully!');
            } else {
                const error = await response.json();
                toast.error(`Error: ${error.message}`);
            }
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const openUpdateModal = (task: AssignedTask) => {
        setSelectedTask(task);
        setNewStatus(task.installation?.status || 'scheduled');
        setUpdateNotes(task.installation?.notes || '');
        setUpdateModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'in_progress':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'completed':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Agent Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your installation tasks
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-blue-600/20 backdrop-blur-sm rounded-2xl border border-blue-200 dark:border-blue-500/30 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 dark:text-blue-200 text-sm font-medium mb-1">
                                    Assigned Tasks
                                </p>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                                    {stats.assignedApplications}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/30 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gradient-to-br dark:from-yellow-500/20 dark:to-yellow-600/20 backdrop-blur-sm rounded-2xl border border-yellow-200 dark:border-yellow-500/30 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 dark:text-yellow-200 text-sm font-medium mb-1">
                                    In Progress
                                </p>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                                    {stats.inProgressInstallations}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-500/30 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gradient-to-br dark:from-emerald-500/20 dark:to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-emerald-200 dark:border-emerald-500/30 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-600 dark:text-emerald-200 text-sm font-medium mb-1">
                                    Completed
                                </p>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                                    {stats.completedInstallations}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/30 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700/50 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        My Installation Tasks ({tasks.length})
                    </h2>

                    {tasks.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks assigned yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <div
                                    key={task.application.id}
                                    className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 border border-gray-200 dark:border-slate-600/50 hover:border-emerald-500 dark:hover:border-emerald-500/50 transition-all shadow-sm"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {task.application.applicationNumber}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.installation?.status || 'scheduled')}`}>
                                                    {task.installation?.status || 'scheduled'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-1">Customer</p>
                                                    <p className="text-gray-900 dark:text-white font-medium">
                                                        {task.application.applicantName}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {task.application.applicantPhone}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-1">Location</p>
                                                    <p className="text-gray-900 dark:text-white font-medium">
                                                        {task.application.city}, {task.application.state}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {task.application.address}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-1">Capacity</p>
                                                    <p className="text-gray-900 dark:text-white font-medium">
                                                        {task.application.requestedCapacity} kW
                                                    </p>
                                                </div>

                                                {task.installation?.scheduledDate && (
                                                    <div>
                                                        <p className="text-gray-600 dark:text-gray-400 mb-1">Scheduled Date</p>
                                                        <p className="text-gray-900 dark:text-white font-medium">
                                                            {new Date(task.installation.scheduledDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {task.installation?.notes && (
                                                <div className="mt-4 p-3 bg-gray-100 dark:bg-slate-800/50 rounded-lg">
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Notes</p>
                                                    <p className="text-gray-900 dark:text-white text-sm">{task.installation.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 lg:ml-4">
                                            <button
                                                onClick={() => openUpdateModal(task)}
                                                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
                                            >
                                                Update Status
                                            </button>
                                            <a
                                                href={`tel:${task.application.applicantPhone}`}
                                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-center whitespace-nowrap"
                                            >
                                                Call Customer
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Update Status Modal */}
            {updateModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Update Installation Status
                        </h3>

                        <div className="mb-4">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Application</p>
                            <p className="text-gray-900 dark:text-white font-semibold">
                                {selectedTask.application.applicationNumber}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {selectedTask.application.applicantName}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="scheduled">Scheduled</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Notes
                            </label>
                            <textarea
                                value={updateNotes}
                                onChange={(e) => setUpdateNotes(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Add any updates or notes..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setUpdateModalOpen(false);
                                    setSelectedTask(null);
                                }}
                                disabled={isUpdating}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={isUpdating}
                                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                            >
                                {isUpdating ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
