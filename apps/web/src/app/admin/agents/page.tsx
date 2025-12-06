'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { DataTable } from '@/components/ui/DataTable';

interface Agent {
    id: number;
    uuid: string;
    email: string;
    fullName: string;
    phone: string | null;
    avatar: string | null;
    isActive: boolean;
    workload?: {
        assignedApplications: number;
        inProgressInstallations: number;
        completedInstallations: number;
    };
}

interface UnassignedApplication {
    id: number;
    applicationNumber: string;
    applicantName: string;
    city: string;
    requestedCapacity: string;
    approvedAt: string;
}

export default function AgentsManagement() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [unassignedApps, setUnassignedApps] = useState<UnassignedApplication[]>([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [search, setSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);

    const [loadingAgents, setLoadingAgents] = useState(true);
    const [loadingApps, setLoadingApps] = useState(true);

    // Assign Modal State
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<UnassignedApplication | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
    const [assignNotes, setAssignNotes] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
            router.push('/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 'superadmin')) {
            fetchAgents();
        }
    }, [user]);

    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 'superadmin')) {
            fetchUnassignedApps();
        }
    }, [user, page, limit, search]);

    const fetchAgents = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/workload`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            setAgents(data);
        } catch (error) {
            console.error('Error fetching agents:', error);
            toast.error('Failed to load agents');
        } finally {
            setLoadingAgents(false);
        }
    };

    const fetchUnassignedApps = async () => {
        setLoadingApps(true);
        try {
            const queryString = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/agents/unassigned-applications${queryString}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );
            const data = await response.json();

            if (data.meta) {
                setUnassignedApps(data.data);
                setTotalItems(data.meta.total);
            } else {
                setUnassignedApps(Array.isArray(data) ? data : []);
                setTotalItems(Array.isArray(data) ? data.length : 0);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoadingApps(false);
        }
    };

    const handleAssignClick = (application: UnassignedApplication) => {
        setSelectedApplication(application);
        setAssignModalOpen(true);
    };

    const handleAssign = async () => {
        if (!selectedApplication || !selectedAgent) return;

        setIsAssigning(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/assign`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicationId: selectedApplication.id,
                    agentId: selectedAgent,
                    notes: assignNotes,
                }),
            });

            if (response.ok) {
                await fetchUnassignedApps(); // Refresh specific list
                await fetchAgents(); // Refresh agents stats
                setAssignModalOpen(false);
                setSelectedApplication(null);
                setSelectedAgent(null);
                setAssignNotes('');
                toast.success('Application assigned successfully!');
            } else {
                const error = await response.json();
                toast.error(`Error: ${error.message}`);
            }
        } catch (error: any) {
            console.error('Error assigning application:', error);
            toast.error(error.response?.data?.message || 'Failed to assign application');
        } finally {
            setIsAssigning(false);
        }
    };

    const unassignedColumns = [
        {
            key: 'applicationNumber',
            header: 'Application #',
            sortable: true,
            render: (item: UnassignedApplication) => (
                <span className="font-mono text-gray-900 dark:text-white">{item.applicationNumber}</span>
            )
        },
        {
            key: 'applicantName',
            header: 'Applicant',
            sortable: true,
        },
        {
            key: 'city',
            header: 'City',
            sortable: true,
        },
        {
            key: 'requestedCapacity',
            header: 'Capacity',
            sortable: true,
            render: (item: UnassignedApplication) => `${item.requestedCapacity} kW`
        },
        {
            key: 'approvedAt',
            header: 'Approved At',
            sortable: true,
            render: (item: UnassignedApplication) => new Date(item.approvedAt).toLocaleDateString()
        },
        {
            key: 'action',
            header: 'Action',
            render: (item: UnassignedApplication) => (
                <div className="flex justify-end">
                    <button
                        onClick={() => handleAssignClick(item)}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
                    >
                        Assign Agent
                    </button>
                </div>
            )
        }
    ];

    if (loadingAgents && page === 1) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Agent Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Oversee agents, monitor workload, and assign applications.
            </p>

            <div className="space-y-12">
                {/* Agents Grid */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </span>
                        Agents Overview
                    </h2>

                    {agents.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No agents found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 border border-gray-200 dark:border-slate-600/50 hover:border-emerald-500 dark:hover:border-emerald-500/50 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <span className="text-emerald-400 text-xl font-bold">
                                                {agent.fullName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-gray-900 dark:text-white font-semibold">{agent.fullName}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">{agent.email}</p>
                                        </div>
                                    </div>

                                    {agent.workload && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Assigned:</span>
                                                <span className="text-emerald-400 font-semibold">
                                                    {agent.workload.assignedApplications}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">In Progress:</span>
                                                <span className="text-yellow-400 font-semibold">
                                                    {agent.workload.inProgressInstallations}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                                                <span className="text-blue-400 font-semibold">
                                                    {agent.workload.completedInstallations}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600/50">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${agent.isActive
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {agent.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Unassigned Applications */}
                <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700/50 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </span>
                        Unassigned Applications
                    </h2>

                    <DataTable
                        data={unassignedApps}
                        columns={unassignedColumns}
                        loading={loadingApps}
                        isServerSide={true}
                        totalItems={totalItems}
                        onPageChange={(p) => setPage(p)}
                        onSearchChange={(s) => { setSearch(s); setPage(1); }}
                        onLimitChange={(l) => { setLimit(l); setPage(1); }}
                        itemsPerPageOptions={[5, 10, 20]}
                    />
                </div>
            </div>

            {/* Assign Modal */}
            {assignModalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Assign Agent
                        </h3>

                        <div className="mb-4">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Application</p>
                            <p className="text-gray-900 dark:text-white font-semibold">
                                {selectedApplication.applicationNumber}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {selectedApplication.applicantName} - {selectedApplication.city}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Agent
                            </label>
                            <select
                                value={selectedAgent || ''}
                                onChange={(e) => setSelectedAgent(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="">Choose an agent...</option>
                                {agents
                                    .filter((agent) => agent.isActive)
                                    .map((agent) => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.fullName} ({agent.workload?.assignedApplications || 0} assigned)
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={assignNotes}
                                onChange={(e) => setAssignNotes(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Add any special instructions..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setAssignModalOpen(false);
                                    setSelectedApplication(null);
                                    setSelectedAgent(null);
                                    setAssignNotes('');
                                }}
                                disabled={isAssigning}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={!selectedAgent || isAssigning}
                                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAssigning ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
